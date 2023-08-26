"use strict"
const chai = require('chai');
const chaiHttp = require('chai-http');
const {describe, it} = require('mocha')
const {expect} = require('chai');
const User = require('../models/User');


chai.use(chaiHttp);

const BASE_URL = "http://localhost:4000/api/v1/user";

describe("Users", ()=>{

    // before(function(done) {
        
    // });

    const userData = {
        name: "Test User 1",
        email: "test1@gmail.com",
        password: "12345678"
    }

    let loggedInUserToken;

    describe("Register new user", ()=>{

    
        it("when no data is passed", async()=>{
            try {

                const res = await chai.request(`${BASE_URL}`).post('/register');
    
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error').to.equal('Please fill all the fields');
                
            } catch (error) {
                throw error;
            }
        })

        it("when all data is passed", async()=>{
            try {

                const res =  await chai.request(`${BASE_URL}`).post('/register').send(userData)

                expect(res).to.have.status(201);
                expect(res.body).to.have.property("message").to.equal("User created successfully");
                expect(res.body).to.have.property("user").to.haveOwnProperty("email").to.equal(userData.email);
                
            } catch (error) {
                throw(error);
            }
        })

        it("When email is already registered", async()=>{
            try {
                const res = await chai.request(`${BASE_URL}`).post("/register").send(userData)

                expect(res).to.have.status(400);
                expect(res.body).to.have.property("error").to.equal("User with this email already exists");
            } catch (error) {
                throw(error);
            }
        })
    })

    describe("Login User", ()=>{

        it("When email is not registerd", async()=>{

            const res = await chai.request(BASE_URL).post("/login").send({
                email: "notregisterd@gmail.com",
                password: "12345678"
            });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property("error").to.equal("User with this email does not exist");
        })

        it("When email is registerd but wrong password", async()=>{

            const res = await chai.request(BASE_URL).post("/login").send({
                email: userData.email,
                password: "123111178"
            });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property("error").to.equal("Invalid password");
        })
        
        it("When email is registered", async()=>{

            const res = await chai.request(BASE_URL).post("/login").send(userData);
            
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("message").to.equal("User loggedIn successfully");
 
            loggedInUserToken = res.header["set-cookie"][0].split(";")[0].split("=")[1];
        })
    })

    describe("User Profile", ()=>{

        it("Get Loggedin User Profile", async()=>{

            const res = await chai.request(BASE_URL).get("/profile").set('cookie', `token=${loggedInUserToken}`);
            
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("user").to.haveOwnProperty("email").to.equal(userData.email);

        })
    })


    
    after(function(done){
        try {
            const res = chai.request(BASE_URL).put("/delete/profile").send({email:userData.email})
            .then((a)=>{
                done();
            })
        } catch (error) {
            throws(error);
        }
    })

})
