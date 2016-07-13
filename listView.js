'use strict';

import React, {
  Component,
  PropTypes
} from 'react';
import {
  ListView,
  StyleSheet,
  ScrollView,
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
    scrollEventThrottle: 1,
    renderScrollComponent: props => <ScrollView {...props} />
  };
  constructor(props) {
    super(props);

    // this data should never trigger a render pass, so it stays out of state.
    this.sections = [];
    this.rowOffsets = {};
    this.currentSection = null;
  }
  scrollToSection(sectionId) {
    if (this.listView) {
      var section = this.sections.find((section) => section.section === sectionId);
      if (section) {
        this.listView.getScrollResponder().scrollTo(scrollOffset(section.offset));
      }
    }
  }
  scrollToRow(sectionId, rowId) {
    if (this.listView && this.rowOffsets[sectionId] && this.rowOffsets[sectionId][rowId]) {
      this.listView.getScrollResponder().scrollTo(scrollOffset(this.rowOffsets[sectionId][rowId]));
    }
  }

  onSectionHeaderLayout(sectionId, event) {
    var offset = event.nativeEvent.layout.y;
    var sections = this.sections.filter(section => section.section !== sectionId);

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

    this.sections = sections;
  }
  onRowLayout(sectionId, rowId, event) {
    if (!this.rowOffsets[sectionId]) {
      this.rowOffsets[sectionId] = {};
    }
    this.rowOffsets[sectionId][rowId] = event.nativeEvent.layout.y;
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

    this.sections.forEach(currentSection => {
      if (currentSection.offset <= offset) {
        section = currentSection.section;
      }
    });

    if (section && this.currentSection !== section) {
      this.currentSection = section;
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
