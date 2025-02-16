const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/index');
const Video = require('../src/models/videoModel');
const User = require('../src/models/userModel');
const { expect } = chai;

chai.use(chaiHttp);

describe('Video API', () => {
  let token;
  let videoId;

  before(async () => {
    await Video.deleteMany({});
    await User.deleteMany({});
    const res = await chai.request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });
    const loginRes = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    token = loginRes.body.token;
  });

  describe('POST /api/videos', () => {
    it('should create a new video', (done) => {
      chai.request(app)
        .post('/api/videos')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Video', description: 'Test Description', url: 'http://test.com/video.mp4' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message').eql('Vídeo criado com sucesso.');
          videoId = res.body.video._id; // Corrigido para capturar o ID corretamente
          done();
        });
    });
  });

  describe('GET /api/videos', () => {
    it('should get all videos', (done) => {
      chai.request(app)
        .get('/api/videos')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.greaterThan(0);
          done();
        });
    });
  });

  describe('PUT /api/videos/:id', () => {
    it('should update an existing video', (done) => {
      chai.request(app)
        .put(`/api/videos/${videoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Test Video', description: 'Updated Test Description', url: 'http://test.com/updated_video.mp4' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('title').eql('Updated Test Video');
          done();
        });
    });
  });

  describe('DELETE /api/videos/:id', () => {
    it('should delete an existing video', (done) => {
      chai.request(app)
        .delete(`/api/videos/${videoId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').eql('Vídeo excluído com sucesso.');
          done();
        });
    });
  });
});




