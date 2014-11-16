var request = require('superagent'),
  expect = require('expect.js');
  
describe('Recipes Controller', function(){
  var user1_token = "";
  var user1_id = undefined;
  var user2_token = "";
  var user2_id = undefined;
  var ingredient1_id = "";
  var ingredient2_id = "";
  var recipe_id = "";

  before(function(done){
   request
    .post('localhost:8080/sessions')
    .send('{"email": "manawasp@gmail.com", "password": "Manawasp59"}')
    .set('Content-Type', 'application/json')
    .end(function(res)
    {
      expect(res).to.exist;
      expect(res.status).to.equal(200);
      expect(res.body.token).to.exist;
      expect(res.body.user).to.exist;
      expect(res.body.user.id).to.exist;
      user1_id = res.body.user.id;
      user1_token = res.body.token
      request
        .post('localhost:8080/sessions')
        .send('{"email": "superadmin@gmail.com", "password": "Superadmin59"}')
        .set('Content-Type', 'application/json')
        .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.token).to.exist;
        expect(res.body.user).to.exist;
        expect(res.body.user.id).to.exist;
        user2_id = res.body.user.id;
        user2_token = res.body.token
        request
          .post('localhost:8080/ingredients/search')
          .set('Content-Type', 'application/json')
          .set('Auth-Token', user1_token)
          .send('{}')
          .end(function(res)
        {
          expect(res.status).to.equal(200);
          expect(res.body.ingredients).to.exist;
          expect(res.body.ingredients.length).to.equal(2);
          ingredient1_id = res.body.ingredients[0].id
          ingredient2_id = res.body.ingredients[1].id
          done()
        });
      });
    });
  });


  describe('CREATE Recipes', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/recipes')
      .set('Content-Type', 'application/json')
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("you need to be connected");
        done()
      });
    });

    it ("403: don't have the permission", function(done){
     request
      .post('localhost:8080/recipes')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal("you don't have the permission");
        done()
      });
    });

    it ("400: title is undefined", function(done){
     request
      .post('localhost:8080/recipes')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("title is undefined");
        done()
      });
    });

    it ("400: title contain at least 2 characters", function(done){
     request
      .post('localhost:8080/recipes')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{"title":"a"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("title contain at least 2 characters");
        done()
      });
    });


    it ("200: create recipe", function(done){
     request
      .post('localhost:8080/recipes')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{"title":"Pork with sugar", "ingredients": ["'+ingredient1_id+'", "'+ingredient2_id+'"], "savours": ["sugar"], "labels": ["grandchallenge"], "blacklist": ["musulman"], "country": "france", "city": "paris"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        recipe_id = res.body.recipe.id;
        done()
      });
    });

  })

  describe('GET Recipes', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .get('localhost:8080/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("you need to be connected");
        done()
      });
    });

    it ("404: resource not found", function(done){
     request
      .get('localhost:8080/recipes/dedplepf')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("resource not found");
        done()
      });
    });

    it ("200: get recipe information", function(done){
     request
      .get('localhost:8080/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        done()
      });
    });

  })

  describe('UPDATE Recipes', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .patch('localhost:8080/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("you need to be connected");
        done()
      });
    });

    it ("403: don't have the permission", function(done){
     request
      .patch('localhost:8080/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal("you don't have the permission");
        done()
      });
    });

    it ("404: resource not found", function(done){
     request
      .patch('localhost:8080/recipes/dedplepf')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("resource not found");
        done()
      });
    });

    it ("200:  update title", function(done){
     request
      .patch('localhost:8080/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{"title": "Super pork and sugar"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        done()
      });
    });
  })

  describe('DELETE Recipes', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .del('localhost:8080/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("you need to be connected");
        done()
      });
    });

    it ("403: don't have the permission", function(done){
     request
      .del('localhost:8080/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal("you don't have the permission");
        done()
      });
    });

    it ("404: resource not found", function(done){
     request
      .del('localhost:8080/recipes/dedplepf')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("resource not found");
        done()
      });
    });

    it ("200:  delete recipe", function(done){
     request
      .del('localhost:8080/recipes/' + recipe_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{"title": "Super pork and sugar"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal("recipe removed");
        done()
      });
    });
  })

  describe('SEARCH Recipe', function(){

    it ("200: create recipe", function(done){
     request
      .post('localhost:8080/recipes')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user2_token)
      .send('{"title":"Pork with sugar", "ingredients": ["'+ingredient1_id+'", "'+ingredient2_id+'"], "savours": ["sugar"], "labels": ["grandchallenge"], "blacklist": ["musulman"], "country": "france", "city": "paris"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        recipe_id = res.body.recipe.id;
        done()
      });
    });

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("you need to be connected");
        done()
      });
    })

    it ("200: search without pattern", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.recipes).to.exist;
        expect(res.body.recipes.length).to.equal(1);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        expect(res.body.limit).to.be.an('number');
        done()
      });
    });

    it ("200: search with pattern", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{"title":"ug"}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.recipes).to.exist;
        expect(res.body.recipes.length).to.equal(1);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        expect(res.body.limit).to.be.an('number');
        done()
      });
    });

    it ("200: search without pattern + offset", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{"offset":1}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.recipes).to.exist;
        expect(res.body.recipes.length).to.equal(0);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(0);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(1);
        expect(res.body.limit).to.exist;
        done()
      });
    });

    it ("200: search without pattern + savours", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{"savours":["sugar"]}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.recipes).to.exist;
        expect(res.body.recipes.length).to.equal(1);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        done()
      });
    });

    it ("200: search without pattern but with blacklist 'musulman'", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{"blacklist":["musulman"]}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.recipes).to.exist;
        expect(res.body.recipes.length).to.equal(0);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(0);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        done()
      });
    });

    it ("200: search without pattern but with one ingredients", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{"ingredients": ["'+ingredient1_id+'"]}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.recipes).to.exist;
        expect(res.body.recipes.length).to.equal(1);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        done()
      });
    });

    it ("200: search without pattern but with country", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{"country": "france"}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.recipes).to.exist;
        expect(res.body.recipes.length).to.equal(1);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        done()
      });
    });

    it ("200: search without pattern but with labels", function(done){
     request
      .post('localhost:8080/recipes/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', user1_token)
      .send('{"labels": ["grandchallenge"]}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.recipes).to.exist;
        expect(res.body.recipes.length).to.equal(1);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        done()
      });
    });

  });
});