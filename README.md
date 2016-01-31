# react-native-enhanced-listview

This component enhances the `ListView` with additional behavior that is not currently supported.

- Scroll to a section by a sectionId
- Scroll to a row by a rowId
- Receive callbacks when a section changes
- More to come

## Example
```js
import {
  Component,
  View,
  Text
} from 'react-native';
import ListView from 'react-native-enhanced-listview';

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource(..).cloneWithRowsAndSections(..)
    }
  }
  renderSectionHeader() {
    return <View>...</View>
  }
  renderRow() {
    return <View>...</View>
  }
  onSectionChanged(section) {
    console.log('new section')
  }
  scrollToSection(section) {
    // scroll to a specific section
    this.listView.scrollToSection(section);
  }
  render() {
    return (
      <ListView
        ref={component => this.listView = component}
        onSectionChanged={section => this.onSectionChanged(section)}
        renderRow={data => this.renderRow(data)}
        renderSectionHeader={(data, sectionId) => this.renderSectionHeader(data, sectionId)}
        />
    );
  }
}
```

