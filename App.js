import React from "react";
import MainComponent from "./MainComponent"; // Assuming you have a component named MyComponent
import { Provider } from "react-redux";
import { store } from "./redux/store";


const App = () => {
  return (
    <>
    <Provider store={store}>
      <MainComponent />
    </Provider>
    </>
  );
};

export default App;
