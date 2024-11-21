
// Check if we're on a model page
if (document.getElementById('modelCanvas')) {
    import('/js/model-viewer.js')
      .then((module) => {
        module.initModel();
      })
      .catch((err) => {
        console.error('Error loading model viewer:', err);
      });
  }
  