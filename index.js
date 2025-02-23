import { AppRegistry } from "react-native";
import App from "./App";
import MessageScreen from './MessageScreen'; 
import {name as appName} from './app.json'

AppRegistry.registerComponent(appName,() => MessageScreen)