const userInfo = {
    "name" : "홍길동",
    "birthdate" : "2002. 08. 19.",
    "address" : "서울특별시 노원구 공릉로 232 1층",
    "phonenumber" : "010-1234-5679",
};

const pkgInfo = require('./package.json');
const Service = require('webos-service');

const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = `[${pkgInfo.name}]`;

service.register("getUserInfo", (message)=>{
    console.log(logHeader, "SERVICE_METHOD_CALLED:/getUserInfo");

    message.respond({
        returnValue: true,
        Response: JSON.stringify(userInfo),
    });
});