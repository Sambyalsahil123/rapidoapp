import React, { useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View, Modal,
} from 'react-native';
import axios from 'axios';
import Button from 'react-native-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { useTheme, useTranslations } from 'dopenative';
import dynamicStyles from './styles';
import TNActivityIndicator from '../../../truly-native/TNActivityIndicator';
import TNProfilePictureSelector from '../../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector';
import { setUserData } from '../../redux/auth';
import { localizedErrorMessage } from '../../api/ErrorCode';
import TermsOfUseView from '../../components/TermsOfUseView';
import { useOnboardingConfig } from '../../hooks/useOnboardingConfig';
import { useAuth } from '../../hooks/useAuth';
import SignupOnBoard from './SignupOnboard';
import SignupOnboardImg from './SignOnboardImg';
import Img from './upload.png';


const SignupScreen = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const { navigation } = props;
  const authManager = useAuth();
  const dispatch = useDispatch();
  const { config } = useOnboardingConfig();
  const { localized } = useTranslations();
  const { theme, appearance } = useTheme();
  const styles = dynamicStyles(theme, appearance);
  const [inputFields, setInputFields] = useState({});
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOTP] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);


  //////// for AadharValidation
  const handleVerifyOTP = async () => {
    try {
      const response = await fetch('https://api.gov.in/verify-aadhaar-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aadhaarNumber,
          otp,
        }),
      });
      const result = await response.json();
      setVerificationResult(result);
    } catch (error) {
      console.error(error);
    }
  };
  {/* <View>
      <TextInput
        placeholder="Enter your 12-digit Aadhaar number"
        value={aadhaarNumber}
        onChangeText={setAadhaarNumber}
      />
      <TextInput
        placeholder="Enter the OTP"
        value={otp}
        onChangeText={setOTP}
      />
      <button onPress={handleVerifyOTP}>Verify OTP</button>
      {verificationResult && (
        <Text>Verification result: {verificationResult.message}</Text>
      )}
    </View> */}


  const ValidateAadhar = text => {
    let reg = /^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/;
    return reg.test(text) ? true : false;
  };

  const validateEmail = text => {
    let reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(String(text).toLowerCase()) ? true : false;
  };


  const validatePassword = text => {
    let reg = /^(?=.*[A-Z])(?=.*[a-z])/;
    return reg.test(String(text)) ? true : false;
  };

  const trimFields = fields => {
    var trimmedFields = {};
    Object.keys(fields).forEach(key => {
      if (fields[key]) {
        trimmedFields[key] = fields[key].trim();
      }
    });
    return trimmedFields;
  };

  const onRegister = async () => {
    // verifyAadharCard();
    const { error: usernameError } =
      await authManager.validateUsernameFieldIfNeeded(inputFields, config);
    if (usernameError) {
      Alert.alert('', localized(usernameError), [{ text: localized('OK') }], {
        cancelable: false,
      });
      setInputFields(prevFields => ({
        ...prevFields,
        password: '',
      }));
      return;
    }

    if (!validateEmail(inputFields?.email?.trim())) {
      Alert.alert(
        '',
        localized('Please enter a valid email address.'),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      );
      return;
    }

    if (!ValidateAadhar(inputFields?.AadharCard?.trim())) {
      Alert.alert(
        '',
        localized('Please enter a valid  Aadhar Number.'),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      );
      return;
    }
    if (!validatePassword(inputFields?.password?.trim())) {
      Alert.alert(
        '',
        localized('Please enter a valid password.'),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      );
      return;
    }

    if (inputFields?.password?.trim() == '') {
      Alert.alert(
        '',
        localized('Password cannot be empty.'),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      );
      setInputFields(prevFields => ({
        ...prevFields,
        password: '',
      }));
      return;
    }

    if (inputFields?.password?.trim()?.length < 6) {
      Alert.alert(
        '',
        localized(
          'Password is too short. Please use at least 6 characters for security reasons.',
        ),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      );
      setInputFields(prevFields => ({
        ...prevFields,
        password: '',
      }));
      return;
    }

    setLoading(true);

    const userDetails = {
      ...trimFields(inputFields),
      photoFile: profilePictureFile,
      appIdentifier: config.appIdentifier,
    };
    if (userDetails.username) {
      userDetails.username = userDetails.username?.toLowerCase();
    }

    authManager
      .createAccountWithEmailAndPassword(userDetails, config)
      .then(response => {
        const user = response.user;
        if (user) {
          dispatch(setUserData({ user }));
          Keyboard.dismiss();
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainStack', params: { user } }],
          });
        } else {
          setLoading(false);
          Alert.alert(
            '',
            localizedErrorMessage(response.error, localized),
            [{ text: localized('OK') }],
            {
              cancelable: false,
            },
          );
        }
      });
  };

  const onChangeInputFields = (text, key) => {
    setInputFields(prevFields => ({
      ...prevFields,
      [key]: text,
    }));
  };

  const renderInputField = (field, index) => {
    return (
      <>
        <TextInput
          key={index?.toString()}
          style={styles.InputContainer}
          placeholder={field.placeholder}
          placeholderTextColor="#aaaaaa"
          secureTextEntry={field.secureTextEntry}
          onChangeText={text => onChangeInputFields(text, field.key)}
          value={inputFields[field.key]}
          keyboardType={field.type}
          underlineColorAndroid="transparent"
          autoCapitalize={field.autoCapitalize}
        />
      </>
    );
  };

  const renderSignupWithEmail = () => {
    return (
      <>
        {config.signupFields.map(renderInputField)}
        <View style={{ marginTop: 22 }}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              // alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>

            <Text placeholderTextColor="#aaaaaa" style={{ fontSize: 20, fontWeight: '900', textAlign: 'center', marginTop: 40 }}>Required Other Information</Text>
            <Text placeholderTextColor="#aaaaaa" style={{ fontWeight: 'bold', textAlign: 'center', marginTop: 30 }}>Please upload Driving license image for verification.</Text>
            <SignupOnBoard />
            <Text placeholderTextColor="#aaaaaa" style={{ fontWeight: 'bold', textAlign: 'center' }}>Please upload RC image for verification.</Text>
            {/* <SignupOnBoard /> */}
            <SignupOnboardImg />
            <Text placeholderTextColor="#aaaaaa" style={{ fontWeight: 'bold', textAlign: 'center' }}>Please upload Vehicle insurance image for verification.</Text>
            {/* <SignupOnBoard /> */}
            <SignupOnboardImg />



            <Button
              containerStyle={styles.SubmitDoc}
              style={styles.SubmitDocText}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >{localized('Submit')}
            </Button>
          </Modal>
          <TouchableOpacity style={styles.UploadDoc} onPress={() => setModalVisible(true)}>
            <Text style={{ marginTop: 5 }}>Upload Documents     <Image style={{ height: 20, width: 20 }} source={Img} /></Text>
          </TouchableOpacity>
        </View>





        <Button
          containerStyle={styles.signupContainer}
          style={styles.signupText}
          onPress={() => onRegister()}>
          {localized('Sign Up')}
        </Button>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.backArrowStyle} source={theme.icons.backArrow} />
        </TouchableOpacity>
        <Text style={styles.title}>{localized('Create new account')}</Text>
        <TNProfilePictureSelector
          setProfilePictureFile={setProfilePictureFile}
        />
        {renderSignupWithEmail()}
        {config.isSMSAuthEnabled && (
          <>
            <Text style={styles.orTextStyle}>{localized('OR')}</Text>
            <Button
              containerStyle={styles.PhoneNumberContainer}
              onPress={() => navigation.navigate('Sms', { isSigningUp: true })}>
              {localized('Sign up with phone number')}
            </Button>
          </>
        )}
        <TermsOfUseView
          tosLink={config.tosLink}
          privacyPolicyLink={config.privacyPolicyLink}
          style={styles.tos}
        />
      </KeyboardAwareScrollView>
      {loading && <TNActivityIndicator />}
    </View>
  );
};

export default SignupScreen;
