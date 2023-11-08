import {useState} from 'react';
import {PermittedFolderDropDown} from '../types/PermittedFolderDropdown';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DropdownProps {
  value: string;
  setValue: (v: any) => void;
  items: PermittedFolderDropDown[];
  setItems: (v: any) => void;
}

const Dropdown = ({value, setValue, items, setItems}: DropdownProps) => {
  const backgroundColor = '#A6CF98';
  const dropDownBackgroundColor = '#F2FFE9';
  const iconColor = '#03001C';
  const upArrowIconName = 'arrow-up-circle-outline';
  const downArrowIconName = 'arrow-down-circle-outline';
  const tickArrowIconName = 'check-circle-outline';
  const iconSize = 25;

  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <DropDownPicker
      open={openDropdown}
      value={value}
      items={items}
      setOpen={setOpenDropdown}
      setValue={setValue}
      setItems={setItems}
      placeholder={'Select Custom Folder'}
      props={{activeOpacity: 1}}
      ArrowUpIconComponent={({style}) => (
        <Icon
          name={upArrowIconName}
          size={iconSize}
          color={iconColor}
          style={style}
        />
      )}
      ArrowDownIconComponent={({style}) => (
        <Icon
          name={downArrowIconName}
          size={iconSize}
          color={iconColor}
          style={style}
        />
      )}
      TickIconComponent={({style}) => (
        <Icon
          name={tickArrowIconName}
          size={iconSize}
          color={iconColor}
          style={style}
        />
      )}
      arrowIconStyle={{
        width: iconSize,
        height: iconSize,
      }}
      tickIconStyle={{
        width: iconSize,
        height: iconSize,
      }}
      containerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        margin: 5,
      }}
      style={{
        backgroundColor: dropDownBackgroundColor,
        borderWidth: 0,
        borderRadius: 15,
      }}
      dropDownContainerStyle={{
        backgroundColor: backgroundColor,
        borderWidth: 0,
        borderRadius: 15,
      }}
      textStyle={{
        fontSize: 18,
      }}
      onOpen={() => console.log('Add some callback here')} // Needed to close other dropdowns if multiple are in same page
      onClose={() => console.log('Add some callback here')}
    />
  );
};

export default Dropdown;
