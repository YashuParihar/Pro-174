var modelList = [];
var models = null;
AFRAME.registerComponent("markerhandler", {
  init: async function() {
    this.el.addEventListener("markerFound", () => {
      var modelName = this.el.getAttribute("model_name");
      var barcodeValue = this.el.getAttribute("value");
      modelList.push({
        model_name: modelName,
        barcode_value: barcodeValue
      });

      this.el.setAttribute("visible", true);
    });

    this.el.addEventListener("markerLost", () => {
      var modelName = this.el.getAttribute("model_name");
      var index = modelList.findIndex(x => x.model_name === modelName);

      if (index > -1) {
        modelList.splice(index, 1);
      }

      // NOTE: Remove all the childs from base model
    });
  },
  
  isModelPresentInArray: function(arr, val) {
    for (var i of arr) {
      if (i.model_name === val) {
        return true;
      }
    }
    return false;
  },
  tick: async function() {
    if (modelList.length > 1) {
      var isBaseModelPresent = this.isModelPresentInArray(modelList, "base");
      var messageText = document.querySelector("#message-text");

      if (!isBaseModelPresent) {
        messageText.setAttribute("visible", true);
      } else {
        if (models === null) {
          models = await this.getModels();
        }

        messageText.setAttribute("visible", false);
        this.placeTheModel("road", models);
        this.placeTheModel("car", models);
        this.placeTheModel("building1", models);
        this.placeTheModel("building2", models);
        this.placeTheModel("building3", models);
        this.placeTheModel("tree", models);
        this.placeTheModel("sun", models);
      }
    }
  },
  getModels: function() {
    return fetch("js/models.json")
      .then(res => res.json())
      .then(data => data);
  },
  
});
