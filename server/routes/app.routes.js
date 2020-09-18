const PetController = require("../controllers/pet.controller");

module.exports = app => {
    app.get("/api/pets", PetController.getAllPets);
    app.put("/api/pets", PetController.addPet);
    app.delete("/api/pets/:id", PetController.deletePet);
    app.patch("/api/pets/:id", PetController.updatePet);
    app.get("/api/pets/:id", PetController.getPetById);
}