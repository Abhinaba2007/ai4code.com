// Initialize Neural Network Visualization
function initNeuralNetwork() {
  const neuralNetwork = document.getElementById('neuralNetwork');
  
  // Create neurons
  for (let i = 0; i < 30; i++) {
    const neuron = document.createElement('div');
    neuron.classList.add('neuron');
    neuron.style.left = `${Math.random() * 100}%`;
    neuron.style.top = `${Math.random() * 100}%`;
    neuron.style.animationDelay = `${Math.random() * 2}s`;
    neuralNetwork.appendChild(neuron);
  }

  // Create connections
  const neurons = document.querySelectorAll('.neuron');
  neurons.forEach(neuron => {
    if (Math.random() > 0.7) {
      const connection = document.createElement('div');
      connection.classList.add('connection');
      neuralNetwork.appendChild(connection);
    }
  });
}

// Tab Switching Functionality
function setupTabs() {
  const tabs = document.querySelectorAll('.dimension-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Add 3D transition effects
      document.body.style.transform = `rotateX(${Math.random() * 5}deg) rotateY(${Math.random() * 5}deg)`;
      
      // Load corresponding content
      loadTabContent(tab.dataset.tab);
    });
  });
}

// Initialize floating effects
function initFloatingEffects() {
  const cards = document.querySelectorAll('.module-card');
  
  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });
}

// Initialize the portal
document.addEventListener('DOMContentLoaded', () => {
  initNeuralNetwork();
  setupTabs();
  initFloatingEffects();
});