import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Form, Button, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import Message from "../components/Message"
import Loader from "../components/Loader"
import FormContainer from "../components/FormContainer"
import { login } from "../actions/userActions"
import { setContracts } from "../actions/contractActions"

const LoginScreen = (props) => {
  const { location, history,web3Handler,account} = props
  const nft = useSelector((state) => state.contractDetails.nft)
  const marketplace = useSelector((state) => state.contractDetails.marketplace)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split("=")[1] : "/"
  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect, nft])

  const submitHandler = (e) => {
    loadMarketplaceSoldItemCount()
    e.preventDefault()
    dispatch(login(email, password, account,nft,marketplace))
  }
  const loadMarketplaceSoldItemCount = async()=> {
    let count=0;
    if(marketplace){
      const newMarketplaceItemCount = await marketplace.itemCount()
      for(let i=1; i<=newMarketplaceItemCount; i++){
        const item = await marketplace.items(i);
        if(item.sold){
          count++;
        }
      }
      console.log(count);
    }

  }

  const EthWallet = () =>{
    
    web3Handler()}

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button style={{marginTop:"1rem"}} onClick={EthWallet} disabled={account?true:false}>
          Connect Ethereum Wallet
        </Button>

        <Button style={{marginTop:"1rem"}} type='submit' variant='primary' disabled={account? false:true}>
          Sign In
        </Button>


      </Form>


      <Row className='py-3'>
        <Col>
          New Customer?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
