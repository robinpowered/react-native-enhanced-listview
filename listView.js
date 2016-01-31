'use strict';

import React, {
  Component,
  ListView,
  StyleSheet,
  View,
  Text,
  NativeModules
} from 'react-native';

import SmartListView from './smartListView';

const ROW_HEIGHT = 50;
const HEADER_HEIGHT = 20;

class CustomListView extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });
    this.state = {
      dataSource: ds.cloneWithRowsAndSections({}),
      currentSection: 'A'
    };
  }
  componentDidMount() {
    var sections = this.props.data.reduce((map, item) => {
      var letter = item.slice(0, 1).toUpperCase();
      if (!map[letter]) {
        map[letter] = [];
      }
      map[letter].push(item);
      return map;
    }, {});
    this.state.dataSource = this.state.dataSource.cloneWithRowsAndSections(sections);
    this.setState(this.state);
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.currentSection !== nextProps.currentSection) {
      this._listView.scrollToSection(nextProps.currentSection);
      this.state.currentSection = nextProps.currentSection;
      this.setState(this.state);
    }
  }
  renderRow(data, sectionId, rowId) {
    return (
      <View style={styles.row}>
        <Text style={styles.text}>{data}</Text>
      </View>
    )
  }
  renderSectionHeader(sectionData, sectionId) {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{sectionId}</Text>
      </View>
    )
  }
  render () {
    return (
      <SmartListView
        style={styles.listView}
        ref={component => this._listView = component}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        renderSectionHeader={this.renderSectionHeader.bind(this)}
        onSectionChanged={(section) => console.log('section changed', section)}
        ></SmartListView>
    );
  }
}

const styles = StyleSheet.create({
  listView: {
    flex: 1,
    marginTop: 20,
    backgroundColor: 'red'
  },
  row: {
    height: ROW_HEIGHT,
    backgroundColor: 'gray',
    justifyContent: 'center'
  },
  text: {
    color: 'black',
    fontSize: 14
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: 'blue'
  },
  headerText: {
    color: '#fff',
    fontSize: 14
  }
});

export default CustomListView;
