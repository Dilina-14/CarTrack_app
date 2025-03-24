
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      padding: 24,
      backgroundColor: '#121212',
    },  
    formContainer: {      
      backgroundColor: '#1E1E1E', 
      padding: 25,
      marginTop: -25,
      borderRadius: 30, 
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: '#fff',
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    subtitle: {
      fontSize: 15,
      fontWeight: '500',
      color: '#929292',
    },
    
    header: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 3,
      marginTop: -1+5,
    },
    headerImg: {
      width: 170,
      height: 140,
      alignSelf: 'center',
      marginBottom: 20,
    },
   
    form: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    formAction: {
      marginTop: 4,
      marginBottom: 8,
    },
    formLink: {
      fontFamily: 'monospace',
      fontSize: 13,
      fontWeight: '600',
      color: '#fff',
      textAlign: 'left',
      marginBottom: 10, 
      margintop: -15,
    },
    formFooter: {
      borderRadius: 30,
      paddingVertical: 8, 
      fontSize: 15,
      fontWeight: '600',
      color: '#fff',
      textAlign: 'center',
      letterSpacing: 0.15,
      margintop: -15,
    },
    
    input: {
      marginBottom: 16,
    },
    inputLabel: {
      fontFamily: 'monospace',
      fontSize: 13,
      fontWeight: '600',
      color: '#fff',
      marginBottom: 8,
    },
    inputControl: {
      height: 50,
      backgroundColor: '#1E1E1E',
      paddingHorizontal: 16,
      borderRadius: 12,
      fontSize: 15,
      fontWeight: '500',
      color: '#222',
      borderWidth: 1,
      borderColor: '#C9D3DB',
      borderStyle: 'solid',
    },
    eyeIcon: {
      position: 'absolute',
      right: 16,
      top: 12,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -15,
        marginBottom: 10,
        textAlign: 'left',
      },
    btn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderWidth: 1,
      backgroundColor: '#1570EF',
      borderColor: '#075eec',
      marginBottom:0,
    },
    btnText: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '600',
      color: '#fff',
    },
    googleButton: { marginTop: 10, backgroundColor: '#fff', padding: 12, borderRadius: 8, alignItems: 'center' },
  googleButtonText: { color: '#333', fontSize: 16, fontWeight: '600' },
  });
  export default styles;