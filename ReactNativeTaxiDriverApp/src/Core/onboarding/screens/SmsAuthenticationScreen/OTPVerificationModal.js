import React, { useState } from 'react';
import { View, TextInput, Modal, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import dynamicStyles from './styles';
import { useTheme } from 'dopenative';


export const OTPVerificationModal = () => {
    const navigation = useNavigation();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(false);
    const { theme, appearance } = useTheme();

    const Customstyles = dynamicStyles(theme, appearance);

    const handleSubmit = async () => {
        const generatedOTP = await AsyncStorage.getItem('generated_otp');

        if (`${otp}` !== generatedOTP) {
            setError(true);
            return;
        }

        navigation?.navigate('MainStack', {
            // index: 0,
            // routes: [{ name: 'MainStack', params: {  } }],
        });
    };

    return (


        <Modal animationType="slide" transparent={false} >
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image style={Customstyles.backArrowStyle} source={theme.icons.backArrow} />
            </TouchableOpacity>

            <View style={styles.viewContainer}>
                <TextInput
                    style={{
                        ...styles.textField,
                        borderColor: otp.length === 4 ? '#515352' : 'gray',
                        borderWidth: otp.length === 4 ? 2 : 1,
                    }}
                    autoFocus
                    value={otp}
                    keyboardType="number-pad"
                    maxLength={4}
                    onChangeText={text => {
                        setOtp(text);
                        setError(false);
                    }}
                    placeholder="Enter OTP"
                />
                {error && <Text style={styles.error}>Plean Enter Valid OTP</Text>}
                <Button
                    containerStyle={styles.submitButton}
                    buttonStyle={styles.submitButtonStyle}
                    titleStyle={styles.submitTitle}
                    title="Submit"
                    onPress={handleSubmit}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        padding: 20,
        alignItems: 'center',
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    textField: {
        width: '60%',
        padding: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        fontSize: 24,
        letterSpacing: 4,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
        textAlign: 'center',
        color: 'gray',
    },
    submitButton: {
        width: '40%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 10,
        height: 50,
        backgroundColor: 'gray',
    },
    submitButtonStyle: {
        backgroundColor: 'gray',
    },
    submitTitle: {
        color: 'white',
        textAlign: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '100%',
    },
    error: {
        padding: 10,
        color: 'red',
    },
});
