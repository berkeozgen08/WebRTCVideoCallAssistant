import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
        { duration: '1m', target: 50 }, // below normal load
        { duration: '1m', target: 100 }, // normal load
        { duration: '1m', target: 150 }, // around the breaking point
        { duration: '1m', target: 200 }, // beyond the breaking point
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
    }
};

const url = "http://localhost:5077";

export default function () {
    const r1 = http.get(`${url}/`);
    // check(r1, {
    //     'is status 200': (x) => x.status === 200
    // });

    const r2 = http.get(`${url}/Meeting/GetAll`);
    // check(r2, {
    //     'is status 200': (x) => x.status === 200
    // });
    
    const r3 = http.put(`${url}/Customer/Create`, {
		firstName: "stress",
		lastName: "stress",
		email: `${Math.random().toString("16").substring(2)}@gmail.com`,
		phone: "password"
	});
    // check(r3, {
    //     'is status 200': (x) => x.status === 200
    // });

    const r4 = http.get(`${url}/Meeting/ResolveSlug/poyugfui`);
    // check(r4, {
    //     'is status 200': (x) => x.status === 200
    // });

    sleep(1);
}