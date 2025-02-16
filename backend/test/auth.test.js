const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/index');
const User = require('../src/models/userModel');

const { expect } = chai;
chai.use(chaiHttp);

describe('Auth API', () => {
  before(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', (done) => {
      chai.request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message').eql('Usuário registrado com sucesso.');
          done();
        });
    });

    it('should not register a user with existing email', (done) => {
      chai.request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message').eql('Usuário já registrado.');
          done();
        });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('userId');
          done();
        });
    });

    it('should not login with incorrect password', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message').eql('Credenciais inválidas.');
          done();
        });
    });

    it('should not login non-existing user', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message').eql('Credenciais inválidas.');
          done();
        });
    });
  });
});
