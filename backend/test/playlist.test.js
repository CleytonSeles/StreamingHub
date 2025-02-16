const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/index');
const Playlist = require('../src/models/playlistModel');
const User = require('../src/models/userModel');
const { expect } = chai;

chai.use(chaiHttp);

describe('Playlist API', () => {
  let token;
  let playlistId;

  before(async () => {
    await Playlist.deleteMany({});
    await User.deleteMany({});
    const res = await chai.request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });
    const loginRes = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    token = loginRes.body.token;
  });

  describe('POST /api/playlists', () => {
    it('should create a new playlist', (done) => {
      chai.request(app)
        .post('/api/playlists')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Playlist', description: 'Test Description', videos: [] })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message').eql('Playlist criada com sucesso.');
          playlistId = res.body.playlist._id; // Corrigido para capturar o ID corretamente
          done();
        });
    });
  });

  describe('GET /api/playlists', () => {
    it('should get all playlists', (done) => {
      chai.request(app)
        .get('/api/playlists')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.greaterThan(0);
          done();
        });
    });
  });

  describe('PUT /api/playlists/:id', () => {
    it('should update an existing playlist', (done) => {
      chai.request(app)
        .put(`/api/playlists/${playlistId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Test Playlist', description: 'Updated Test Description', videos: [] })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('name').eql('Updated Test Playlist');
          done();
        });
    });
  });

  describe('DELETE /api/playlists/:id', () => {
    it('should delete an existing playlist', (done) => {
      chai.request(app)
        .delete(`/api/playlists/${playlistId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').eql('Playlist excluída com sucesso.');
          done();
        });
    });
  });
});

