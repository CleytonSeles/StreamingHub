// Função para reportar métricas vitais da web (Web Vitals)
const reportWebVitals = onPerfEntry => {
  // Verifica se onPerfEntry é uma função
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Importa dinamicamente o módulo 'web-vitals'
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Chama as funções de métricas vitais e passa onPerfEntry como callback
      getCLS(onPerfEntry);  // Cumulative Layout Shift
      getFID(onPerfEntry);  // First Input Delay
      getFCP(onPerfEntry);  // First Contentful Paint
      getLCP(onPerfEntry);  // Largest Contentful Paint
      getTTFB(onPerfEntry); // Time to First Byte
    });
  }
};

// Exporta a função reportWebVitals como padrão
export default reportWebVitals;

