import {AuthService} from "../../services/auth.service";
import {ServiceErrorCode} from "../../services/service.result";
import {ChangeEvent, useState} from "react";
import {ISubscribe} from "../../models/subscribe.model";
import './Subscribe.css';
import {useNavigate} from "react-router-dom";

function Subscribe() {
    const [sub, setSub] = useState<ISubscribe>({
        login: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState<string>();
    const navigate = useNavigate();

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value;
        setSub((old) => {
            old.login = text;
            return old;
        });
    }

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value;
        setSub((old) => {
            old.password = text;
            return old;
        });
    }

    const handleSubscribe = async () => {
        const result = await AuthService.subscribe(sub);
        if(result.errorCode === ServiceErrorCode.success) {
            navigate('/login');
            return;
        }
        if(result.errorCode === ServiceErrorCode.conflict) {
            setErrorMessage('Email already exists');
            return;
        }
        setErrorMessage('Internal server error');
    };

    return (
        <div id={"subscribe-container"}>
            <h1>Subscribe</h1>
            <label>Identifiant :</label><br></br>
            <input type="text" placeholder='Identifiant' onChange={handleEmailChange}/><br></br>
            <label>Password :</label><br></br>
            <input type="password" placeholder='Password' onChange={handlePasswordChange}/><br></br>
            {
            errorMessage &&
                <p id="subscribe-error-message">{errorMessage}</p>
            }
            <button onClick={handleSubscribe}>Subscribe</button>
        </div>
    )
}

export default Subscribe;