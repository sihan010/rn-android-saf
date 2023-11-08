import {useState} from 'react';
import {StyleSheet, View, useColorScheme} from 'react-native';
import {Text, PaperProvider, Button, useTheme} from 'react-native-paper';
import RNBlobUtil from 'react-native-blob-util';
import {
  openDocumentTree,
  copyFile,
  releasePersistableUriPermission,
  getPersistedUriPermissions,
} from 'react-native-saf-x';
import {PermittedFolderDropDown} from '../types/PermittedFolderDropdown';
import Dropdown from './DropDown';

const StorageScreen = () => {
  const downloadDirectory = `${RNBlobUtil.fs.dirs.CacheDir}/reactsaf/`;
  let downUri = 'https://files.testfile.org/anime.mp3';

  const [downloadedFilepath, setDownloadedFilePath] = useState('');

  const [selectedFolder, setSelectedFolder] = useState('');
  const [permittedFolders, setPermittedFolders] = useState<
    PermittedFolderDropDown[]
  >([]);

  const theme = useTheme();

  const downloadToAppCache = () => {
    RNBlobUtil.config({
      path: `${downloadDirectory}audio/anime.mp3`,
    })
      .fetch('GET', downUri)
      .then(res => {
        console.log('The file saved to ', res.path());
        setDownloadedFilePath(res.path());
      });
  };

  const createOrGetFolderPermission = async () => {
    try {
      const result = await openDocumentTree(true);
      if (result) {
        console.log(result);
        setPermittedFolders([
          ...permittedFolders,
          {label: result.name, value: result.uri},
        ]);
      } else console.log('No folder selected');
    } catch (ex) {
      console.log(ex);
    }
  };

  const copyToCustomFolder = async (source: string) => {
    if (source === '') return;
    if (selectedFolder === '') console.log('No permitted folder');
    let filepath = source.replace(downloadDirectory, '');
    let result = await copyFile(source, `${selectedFolder}/${filepath}`, {
      replaceIfDestinationExists: true,
    });
    if (result) {
      console.log(result);
    } else console.log('File was not copied');
  };

  const copyToInternalMediaFolder = async (
    source: string,
    folder: 'Download' | 'Audio' | 'Video' | 'Image',
  ) => {
    try {
      if (source === '') return;
      let splited = source.split('/');
      let fileName = splited.pop();
      let parentFolder = splited.join('/').replace(downloadDirectory, '');

      let result = await RNBlobUtil.MediaCollection.copyToMediaStore(
        {
          name: fileName,
          parentFolder: parentFolder,
          mimeType: '',
        },
        folder, // "Audio" | "Image" | "Video" | "Download"
        source, // Path to the file being copied in the apps own storage
      );
      if (result) {
        console.log(result);
      } else console.log('File was not copied');
    } catch (ex) {
      console.log(ex);
    }
  };

  const clearCache = async () => {
    await RNBlobUtil.fs.unlink(downloadDirectory);
    setDownloadedFilePath('');
  };

  const releasePermittedFolders = async () => {
    let permittedFolders = await getPersistedUriPermissions();
    for (let permittedFolder of permittedFolders) {
      await releasePersistableUriPermission(permittedFolder);
    }
    setPermittedFolders([]);
    setSelectedFolder('');
  };

  return (
    <PaperProvider>
      <View
        style={{
          ...styles.container,
          backgroundColor: useColorScheme() !== 'dark' ? '#FAF0E6' : '#03001C',
        }}>
        <Text variant="headlineMedium">React Native - Android</Text>
        <Text variant="bodyLarge">Storage Access framework</Text>

        <View style={styles.separator} />

        <Button
          mode="contained"
          style={styles.button}
          buttonColor="#557C55"
          textColor={theme.colors.background}
          onPress={createOrGetFolderPermission}>
          Get folder permission
        </Button>
        {permittedFolders.length > 0 && (
          <>
            <Dropdown
              value={selectedFolder}
              setValue={setSelectedFolder}
              items={permittedFolders}
              setItems={setPermittedFolders}
            />
            <Button
              mode="contained"
              style={styles.button}
              buttonColor={theme.colors.error}
              textColor={theme.colors.background}
              onPress={releasePermittedFolders}>
              Release folder permissions
            </Button>
          </>
        )}

        <View style={styles.separator} />

        <Button
          mode="contained"
          style={styles.button}
          onPress={downloadToAppCache}>
          Download file to App Cache
        </Button>

        {downloadedFilepath !== '' && (
          <>
            <View style={styles.separator} />
            {selectedFolder !== '' && (
              <Button
                mode="contained"
                style={styles.button}
                buttonColor="#FA7070"
                onPress={() => copyToCustomFolder(downloadedFilepath)}>
                Copy to Custom Folder
              </Button>
            )}
            <Button
              mode="contained"
              style={styles.button}
              onPress={() =>
                copyToInternalMediaFolder(downloadedFilepath, 'Download')
              }>
              Copy to Internal Downloads
            </Button>

            <Button
              mode="contained"
              style={styles.button}
              buttonColor={theme.colors.error}
              textColor={theme.colors.background}
              onPress={clearCache}>
              Clear App cache
            </Button>
          </>
        )}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginVertical: 5,
  },
  separator: {
    width: '100%',
    height: 5,
    backgroundColor: '#A6CF98',
    marginVertical: 5,
  },
});

export default StorageScreen;
