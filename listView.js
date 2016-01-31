'use strict';

import React, {
  Component,
  ListView,
  StyleSheet,
  View,
  Text
} from 'react-native';

class EnhancedListView extends Component {
  static DataSource = ListView.DataSource;
  constructor(props) {
    super(props);
    this.state = {
      sectionOffsets: {},
      rowOffsets: {},
      currentSection: null
    };
  }
  scrollToSection(sectionId) {
    if (this.listView && this.state.sectionOffsets[sectionId]) {
      this.listView.getScrollResponder().scrollTo(this.state.sectionOffsets[sectionId]);
    }
  }
  scrollToRow(sectionId, rowId) {
    if (this.listView && this.state.rowOffsets[sectionId] && this.state.rowOffsets[sectionId][rowId]) {
      this.listView.getScrollResponder().scrollTo(this.state.rowOffsets[sectionId][rowId]);
    }
  }
  onSectionHeaderLayout(sectionId, event) {
    this.state.sectionOffsets[sectionId] = event.nativeEvent.layout.y;
    this.setState(this.state);
  }
  onRowLayout(sectionId, rowId, event) {
    if (!this.state.rowOffsets[sectionId]) {
      this.state.rowOffsets[sectionId] = {};
    }
    this.state.rowOffsets[sectionId][rowId] = event.nativeEvent.layout.y;
    this.setState(this.state);
  }
  renderSectionHeader(sectionData, sectionId) {
    return React.cloneElement(this.props.renderSectionHeader(sectionData, sectionId), {
      onLayout: (event) => this.onSectionHeaderLayout(sectionId, event)
    });
  }
  renderRow(data, sectionId, rowId) {
    return React.cloneElement(this.props.renderRow(data, sectionId, rowId), {
      onLayout: (event) => this.onRowLayout(sectionId, rowId, event)
    });
  }
  onScroll(event) {
    if (this.props.onScroll) {
      this.props.onScroll(event);
    }
    if (!this.props.onSectionChanged) {
      return;
    }
    var offset = event.nativeEvent.contentOffset.y;
    var section;

    for (let sectionId in this.state.sectionOffsets) {
      if (this.state.sectionOffsets[sectionId] <= offset) {
        section = sectionId;
      }
    }
    if (section && this.state.currentSection !== section) {
      this.state.currentSection = section;
      this.setState(this.state);
      if (this.props.onSectionChanged) {
        this.props.onSectionChanged(section);
      }
    }
  }
  render() {
    return <ListView
      {...this.props}
      onScroll={this.onScroll.bind(this)}
      ref={component => this.listView = component}
      renderRow={this.renderRow.bind(this)}
      renderSectionHeader={this.renderSectionHeader.bind(this)}/>
  }
}

export default EnhancedListView;
