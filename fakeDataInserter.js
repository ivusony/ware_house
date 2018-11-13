{
    const faker = require('faker');
    const Unit = require("./models/unitModel");


    let somePromise = new Promise((resolve, reject)=>{
        let fakeData = {};
        for (let i = 0; i < 10; i++) {
            fakeArr.push(faker.commerce.productName())
        }
         resolve(fakeArr)
    })

    somePromise.then((data)=>{
        console.log(data)
    })

}