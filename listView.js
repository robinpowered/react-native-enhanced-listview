'use strict';

import React, {
  Component,
  PropTypes
} from 'react';
import {
  ListView,
  StyleSheet,
  View,
  Text
} from 'react-native';

// arbitrarily large distance to pre-render all sections for measurements
const RENDER_AHEAD_DISTANCE = 1000000;

const scrollOffset = y => ({
  y,
  x: 0,
  animated: true
});

class EnhancedListView extends Component {
  static DataSource = ListView.DataSource;
  static propTypes = {
    ...ListView.propTypes,
    onSectionChanged: PropTypes.func
  };
  static defaultProps = {
    // arbitrarily large distance to pre-render all sections for measurements
    scrollRenderAheadDistance: 1000000,
    scrollEventThrottle: 1
  };
  constructor(props) {
    super(props);
    this.state = {
      sections: [],
      rowOffsets: {},
      currentSection: null
    };
  }
  scrollToSection(sectionId) {
    if (this.listView) {
      var section = this.state.sections.find((section) => section.section === sectionId);
      if (section) {
        this.listView.getScrollResponder().scrollTo(scrollOffset(section.offset));
      }
    }
  }
  scrollToRow(sectionId, rowId) {
    if (this.listView && this.state.rowOffsets[sectionId] && this.state.rowOffsets[sectionId][rowId]) {
      this.listView.getScrollResponder().scrollTo(scrollOffset(this.state.rowOffsets[sectionId][rowId]));
    }
  }
  onSectionHeaderLayout(sectionId, event) {
    var offset = event.nativeEvent.layout.y;
    var sections = this.state.sections.filter(section => section.section !== sectionId);

    sections.push({
      offset,
      section: sectionId
    });
    sections = sections.sort((a, b) => {
      if (a.offset < b.offset) {
        return -1;
      } else if (a.offset > b.offset) {
        return 1;
      }
      return 0;
    });

    this.state.sections = sections;
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

    this.state.sections.forEach(currentSection => {
      if (currentSection.offset <= offset) {
        section = currentSection.section;
      }
    });

    if (section && this.state.currentSection !== section) {
      this.state.currentSection = section;
      this.setState(this.state);
      if (this.props.onSectionChanged) {
        this.props.onSectionChanged(section);
      }
    }
  }
  render() {
    return (
      <ListView
        {...this.props}
        ref={component => this.listView = component}
        onScroll={this.onScroll.bind(this)}
        renderRow={this.renderRow.bind(this)}
        renderSectionHeader={this.renderSectionHeader.bind(this)}
      />
    );
  }
}

export default EnhancedListView;
