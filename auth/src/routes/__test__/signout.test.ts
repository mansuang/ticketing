import request from 'supertest';
import { app } from '../../app';

it('clear the cookie after sign out', async () => {
    const signupResponse = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    // console.log(signupResponse.get('Set-Cookie'));
    expect(signupResponse.get('Set-Cookie')?.join('')).toContain('session=eyJ');


    const logoutResponse = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200);

    expect(logoutResponse.get('Set-Cookie')?.join('')).toContain('session=;');
});

