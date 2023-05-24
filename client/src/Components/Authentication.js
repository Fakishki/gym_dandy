import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import { Button, Form, Message } from "semantic-ui-react";


function Authentication({updateUser}) {
    const [signUp, setSignUp] = useState(false)
    const navigate = useNavigate()
    const [errors, setErrors] = useState(null);
    const [formValues, setFormValues] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleClick = () => setSignUp((signUp) => !signUp)

    const validateForm = () => {
        let isValid = true
        let errors = {}

        if (!formValues.username) {
            isValid = false
            errors.username = "Enter a username"
        }
        if (!formValues.password) {
            isValid = false
            errors.password = "Please enter a password"
        }
        if (signUp && !formValues.email) {
            isValid = false
            errors.email = "Enter an email"
        }

        setErrors(errors)

        return isValid
    }

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value })
    }
    
    const handleSubmit = (e) => {
        // e.preventDefault() // might not need this
        if (validateForm()) {
            fetch(signUp ? "/signup" : "/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formValues)
            })
            .then(res => {
                if (res.ok){
                    res.json()
                    .then(user => {
                        console.log(user)
                        updateUser(user)
                        setErrors(null)
                        navigate("/")
                    })
                } else {
                    res.json().then(setErrors)
                }
            })
        }
    }
    return (
        <>
          {errors && Object.keys(errors).map(input => <Message error>{errors[input]}</Message>)}
          {errors && <Message error>{errors.message}</Message>}
          <h2>Please Login or Sign Up to access endorFun</h2>
          <h2>{signUp ? "Already a user?" : "Not a user?"}</h2>
          <Button onClick={handleClick}>{signUp ? "Log In" : "Register"}</Button>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <label>Username</label>
              <input type="text" name="username" value={formValues.username} onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input type="password" name="password" value={formValues.password} onChange={handleChange} />
            </Form.Field>
            {signUp && (
              <Form.Field>
                <label>Email</label>
                <input type="text" name="email" value={formValues.email} onChange={handleChange} />
              </Form.Field>
            )}
            <Button type="submit">{signUp ? "Sign Up" : "Log In"}</Button>
          </Form>
        </>
    );
}
    
export default Authentication;
