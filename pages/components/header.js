import { BsBrightnessHighFill, BsFillMoonFill } from 'react-icons/bs';
import styles from "../index.module.css";
import { useState, useEffect } from "react";
import Switch from "react-switch";
import { setCookie, hasCookie, getCookie  } from 'cookies-next';

export default function Header({ sendMode }) {

    const [mode, setMode] = useState('');
    const [voice,setVoice] = useState(false);

    const changeMode = (cngMode) => {
        setMode(cngMode);
        sendMode(cngMode);
        setCookie('mode', cngMode);
    }

    const handleChange = () => {
        setVoice(!voice);
        setCookie('voice', !voice);
    }


    useEffect(()=>{
        if(hasCookie('mode')){
            sendMode(getCookie('mode'));
            setMode(getCookie('mode'));
        }else{
            sendMode('day');
            setMode('day');
        }

        if(hasCookie('voice')){
            setVoice(getCookie('voice'))
        }else{
            setVoice(false);
        }
    },[])

    return (
        <div className={styles.header}>
            <div className={`${styles.options} ${styles.optionText}`}>Voice Reply</div>
            <Switch
                checked={voice}
                onChange={handleChange}
                onColor="#86d3ff"
                onHandleColor="#2693e6"
                handleDiameter={25}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={50}
                className={`${styles.options} ${styles.switch}`}
                id="material-switch"
            />
            {mode == "day" && (<BsFillMoonFill size={25} className={`${styles.moon} ${styles.icons}`} onClick={() => changeMode("night")} />)}
            {mode == "night" && (<BsBrightnessHighFill className={`${styles.sun} ${styles.icons}`} size={30} onClick={() => changeMode("day")} />)}
        </div>
    )
}