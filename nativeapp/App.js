import React, {useEffect, useState} from 'react';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Alert,
  Clipboard,
  Dimensions,
  ScrollView
} from 'react-native';
console.disableYellowBox = true;


export default function InstaaSnap() {
  
  const [textValue, setTextValue] = useState('');
  const [isTosAccepted, setTosAccepted] = useState(null);
  const [indicator, setIndicator] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('alreadyAccepted');
        if (value === 'true') {
          setTosAccepted(true);
        } else {
          setTosAccepted(false);
        }
      } catch(e) {
        console.log('error:', e)
      }
    }; getData();
  },[])

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('alreadyAccepted', 'true');
    } catch(e) {
      console.log('error:', e)
    }
  }

  const appAlert = async (alertReason) => {
    setIndicator(false);
    if (alertReason === 'emptyClipboard') {
      Alert.alert(
        'Nothing in clipboard',
        'Please copy the post link from Instagram then press the `Copy From Clipboard` button.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } else if (alertReason === 'wrongURL') {
        Alert.alert(
          'Nothing in clipboard',
          'Please copy the post link from Instagram then press the `Copy From Clipboard` button.',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
    } else if (alertReason === 'saveSuccess') {
      Alert.alert(
        'Post saved successfully',
        'Thanks for using our app, we hope it helped you.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } else if (alertReason === 'saveFailed') {
      Alert.alert(
        'Failed to save post',
        'Something went wrong, please try again later while we fix the issue.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } else if (alertReason === 'somethingWentWrong') {
      Alert.alert(
        'Something went wrong',
        'Please try again later while we fix the issue.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  }

  const fetchCopiedText = async () => {
    try {
      const text = await Clipboard.getString();
      if (text.length === 0){
        appAlert('emptyClipboard');
      } else {
        setTextValue(text);
      }
    } catch(e) {
      console.log('error:', e)
    }
  }

  const fetchMedia = async () => {
    setIndicator(true);
    let postURL = textValue;
    await axios
      .get('https://instaasnap.app/nativeapi/?postURL=' + postURL)
      .then(async response => {
        console.log(response.data);
        if (response.data === 'Wrong Post URL'){
          appAlert('wrongURL');
        } else if (response.data.mediaList.length === 1) {
          if (response.data.mediaList[0].search('.mp4') === -1) {
            RNFetchBlob.config({fileCache: true, appendExt: 'jpg'})
              .fetch('GET', response.data.mediaList[0])
              .then(res => {
                CameraRoll.save(res.data, 'photo')
                  .then(() => {
                    appAlert('saveSuccess');
                  })
                  .catch(err => {
                    appAlert('saveFailed');
                  });
              });
          } else {
            RNFetchBlob.config({fileCache: true, appendExt: 'mp4'})
              .fetch('GET', response.data.mediaList[0])
              .then(res => {
                CameraRoll.save(res.data, 'video')
                  .then(() => {
                    appAlert('saveSuccess');
                  })
                  .catch(err => {
                    appAlert('saveFailed');
                  });
              });
          }
        } else if (response.data.mediaList.length > 1) {
          let maxCount = response.data.mediaList.length;
          let count = 0;
          for (let mediaFile of response.data.mediaList) {
            if (mediaFile.search('.mp4') === -1) {
              RNFetchBlob.config({fileCache: true, appendExt: 'jpg'})
                .fetch('GET', mediaFile)
                .then(res => {
                  CameraRoll.save(res.data, 'photo')
                    .then(() => {
                      count++;
                      if (count === maxCount) {
                        appAlert('saveSuccess');
                      }
                    })
                    .catch(err => {
                      if (count === maxCount) {
                        appAlert('saveFailed');
                      }
                    });
                });
            } else {
              RNFetchBlob.config({fileCache: true, appendExt: 'mp4'})
                .fetch('GET', mediaFile)
                .then(res => {
                  CameraRoll.save(res.data, 'video')
                    .then(() => {
                      count++;
                      if (count === maxCount) {
                        appAlert('saveSuccess');
                      }
                    })
                    .catch(err => {
                      if (count === maxCount) {
                        appAlert('saveFailed');
                      }
                    });
                });
            }
          }
        } else {
          appAlert('somethingWentWrong');        
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const submitTos = () => {
    storeData();
    setTosAccepted(true);
  }

  if (isTosAccepted === null) {
    return null;
  } else if (isTosAccepted === false) {
    return (
      <View style={styles.container}>
        <ScrollView>
        <Text style={styles.tosTitle}>Terms and conditions</Text>
        <View style={styles.tosContainer}>
          <Text style={styles.tosPara}>Welcome to our InstaaSnap. If you continue to browse and use this app, you are agreeing to comply with and be bound by the following terms and conditions :</Text>
          <Text style={styles.tosPara}>We have no mechanism to check any copyright or other IP rights, on downloading file and content over the internet. It's the user's responsibility to check if the content you want to download is protected under any copyrights and make sure that you're allowed to download, copy and share the content.</Text>
          <Text style={styles.tosPara}>You're allowed to download, copy and share the content if saving and sharing comes under fair usage and other exceptions to copyright as defined by Instagram's fair usage and exceptions to copyright policy.</Text>
          <Text style={styles.tosPara}>You're allowed to download, copy and share the content if the copyright owner has clearly stated that you may freely use the image without obtaining permission.</Text>
          <Text style={styles.tosPara}>InstaaSnap does not backup/archive user content for any reason and doesn’t collect any of the user's information which makes using InstaaSnap totally anonymous.</Text>
          <TouchableOpacity onPress={ submitTos } style={styles.tosButton}><Text style={styles.buttonLabel}>Accept</Text></TouchableOpacity>
        </View>
        </ScrollView>
      </View>
    );
  } else if (isTosAccepted === true) {
    return (
    <View style={styles.mainView}>
      <Text style={styles.mainViewTitle}></Text>
      <View style={styles.viewOne}>
        <TextInput
          placeholder="https://www.instagram.com/p/mrwuv6sso2r/"
          style={styles.viewOneInput}
          value={textValue}
          onChangeText={setTextValue}
        />                                                  
      </View>
      <View style={styles.viewTwo}>
        <TouchableOpacity onPress={ fetchCopiedText } style={styles.viewTwoBtn}>
          <Text style={styles.viewTwoBtnText}>Copy From Clipboard</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.viewTwo}>
        <TouchableOpacity onPress={ fetchMedia } style={styles.viewTwoBtn}>
          <Text style={styles.viewTwoBtnText}>Download <ActivityIndicator style={styles.viewTwoBtnIndicator} size="small" color="black" animating={indicator} /></Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.viewTwoTitle}>Save Public Instagram Post And Reels</Text>
    </View>
    );
  }
}

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  mainViewTitle: {
    marginTop: height * 0.2,
    marginHorizontal: 35,
    marginBottom:30,
    textAlign: 'center',
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: 21,
    lineHeight:35,
  },
  viewTwoTitle: {
    marginTop: 12,
    marginHorizontal: 35,
    marginBottom:30,
    textAlign: 'center',
    color: '#222',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    lineHeight:25,
  },
  viewOne: {
    backgroundColor: '#ffffff',
    marginHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(34, 34, 34, 0.05)',
  },
  viewOneInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  viewTwo: {
    backgroundColor: '#fddd02',
    borderColor: '#000',
    marginTop: 15,
    marginHorizontal: 25,
    borderRadius: 50,
  },
  viewTwoBtn: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  viewTwoBtnText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  viewTwoBtnIndicator: {
    marginRight: -25,
    marginLeft: 5
  },
  container:{
    flex: 1,
    marginVertical: height * 0.15,
  },
  tosTitle: {
      fontSize: 26,
      alignSelf: 'flex-start',
      fontFamily: 'Poppins-Medium',
      marginHorizontal: 35
  },
  tosPara: {
      marginTop: 10,
      marginBottom: 0,
      fontSize: 16,
      fontFamily: 'Poppins-Light',
      marginHorizontal: 35
  },
  tosContainer: {
      marginTop: 15,
      marginBottom: 0,
  },

  tosButton:{
      marginHorizontal: 35,
      marginTop: 35,
      backgroundColor: '#ffdd00',
      borderRadius: 50,
      paddingHorizontal: 10,
      paddingVertical: 12,
  },

  buttonLabel:{
      fontSize: 16,
      color: '#000',
      alignSelf: 'center',
      fontFamily: 'Poppins-Regular'
  }
});
