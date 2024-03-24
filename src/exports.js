import Home from "./pages/home/home.jsx";
import Navbar from "./components/navbar/navbar.jsx";
import Connections from "./pages/connections/connections.jsx";
import Create from "./pages/create/create.jsx";
import Settings from "./pages/settings/settings.jsx";
import Wordle from "./pages/wordle/wordle.jsx";
import MultiplayerWordle from "./components/multiplayer/wordle.jsx";
import Input from "./components/wordle/input.jsx"
import MultiplayerInput from "./components/multiplayer/input.jsx"
import MultiplayerKeyboard from "./components/multiplayer/keyboard.jsx"
import Keyboard from "./components/wordle/keyboard.jsx";
import Loading from "./components/loading/loading.jsx";
import Multiplayer from "./pages/multiplayer/multiplayer.jsx";
import ChatBox from "./components/multiplayer/controlCenter/chatbox.jsx";
import Login from "./components/login/login.jsx";
import WordBox from "./components/connections/wordBox.jsx";
import ControlCenter from "./components/connections/controlCenter.jsx";
import MultiplayerControlCenter from "./components/multiplayer/controlCenter.jsx"
import CategoryCard from "./components/create/categoryCard.jsx";
import CreateControlCenter from "./components/create/controlCenter.jsx";
import Mistakes from "./components/connections/mistakes.jsx";
import Restart from "./components/multiplayer/controlCenter/restart.jsx";
import Session from "./components/multiplayer/controlCenter/session.jsx";
import ConfirmAlert from "./components/alert/confirmAlert.jsx";
import Backdrop from "./components/backdrop/backdrop.jsx";

import keyboard_light_mode_backspace from './assets/keyboard_light_mode_backspace.png'
import keyboard_dark_mode_backspace from './assets/keyboard_dark_mode_backspace.png'
import puzzle_fuzion from "./assets/puzzle_fusion.png"

const colors = {
    "pf-dark-background": "#1A202C",
    "pf-light-background": "#F7FAFC",
    "pf-dark-text": "#2D3748",
    "pf-light-text": "#E2E8F0",
    "pf-dark-button": "#2B6CB0",
    "pf-light-button": "#68D391",
    "pf-keyboard-background" : "rgb(129,131,132)",
    "pf-absent": "#A0AEC0",
    "pf-present": "#ED8936",
    "pf-correct": "#38A169",
    "pf-connection-select": "#EFEFE6"
}

export { Home, Navbar, Wordle, MultiplayerWordle, MultiplayerInput, MultiplayerKeyboard,
    Connections, Create, Settings, Input, Keyboard, Loading, Multiplayer, ChatBox, Login,
    WordBox, ControlCenter, CategoryCard, CreateControlCenter, Mistakes, MultiplayerControlCenter,
    Restart, Session, ConfirmAlert, Backdrop,
    keyboard_light_mode_backspace, keyboard_dark_mode_backspace, puzzle_fuzion, colors
}

