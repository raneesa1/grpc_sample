const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../protos/recipes.proto'));
const recipesProto = grpc.loadPackageDefinition(packageDefinition);

const RECIPES = [
    {
        id: 100,
        productId: 1000,
        title: 'Pizza',
        notes: 'See video: pizza_recipe.mp4. Use oven No. 12'
    },
    {
        id: 200,
        productId: 2000,
        title: 'pasta',
        notes: 'recipe is available in youtube'
    },
    {
        id: 300,
        productId: 3000,
        title: 'noodles',
        notes: 'go and visit china store to get chineese noodles'
    }
];

function findRecipe(call, callback) {
    let recipe = RECIPES.find((recipe) => recipe.productId == call.request.id);
    if (recipe) {
        callback(null, recipe);
    } else {
        callback({
            message: 'Recipe not found',
            code: grpc.status.INVALID_ARGUMENT
        });
    }
}

const server = new grpc.Server();
server.addService(recipesProto.Recipes.service, { findRecipe });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log(' recipe-service started successfully. Listening on port 50051.');
});
