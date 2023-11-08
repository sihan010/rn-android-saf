import {PaperProvider} from 'react-native-paper';
import StorageScreen from './components/StorageScreen';

const App = () => {
  return (
    <PaperProvider>
      <StorageScreen />
    </PaperProvider>
  );
};

export default App;
