import {ChangeEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthService} from "../../services/auth.service";
import {ServiceErrorCode} from "../../services/service.result";
import {ILogin} from "../../models/login.model";

function Login() {

    const [log, setLog] = useState<ILogin>({
        login: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState<string>();
    const navigate = useNavigate();

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value;
        setLog((old) => {
            old.login = text;
            return old;
        });
    }

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value;
        setLog((old) => {
            old.password = text;
            return old;
        });
    }

    const handleLogin = async () => {
        console.log('Hellooo')
        const res = await AuthService.login(log);
        if(res.errorCode === ServiceErrorCode.success && res.result) {
            localStorage.setItem("token", res.result.token);
            console.log(res.result.token)
            navigate('/team');
            /*if(res.result.user.accesses.indexOf('admin') === -1) {
                navigate('/team');
            } else {
                navigate('/admin/home');
            }*/
            return;
        }
        if(res.errorCode === ServiceErrorCode.notFound) {
            setErrorMessage('Invalid credentials');
            return;
        }
        setErrorMessage('Internal server error');
    };

    return (
        <div>
            <h1>Login</h1>
            <input type="text" placeholder='Email Address' onChange={handleEmailChange}/>
            <input type="password" placeholder='Password' onChange={handlePasswordChange}/>
            <button onClick={handleLogin}>Login</button>
            {
                errorMessage &&
                <p id="login-error-message">{errorMessage}</p>
            }
        </div>
    )
}

export default Login;