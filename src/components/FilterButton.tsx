import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {colors} from '../styles/theme';

function FilterButton() {
  return (
    <Pressable accessibilityLabel="필터" style={styles.button}>
      <View style={styles.row}>
        <View style={styles.line} />
        <View style={[styles.knob, styles.knobRight]} />
      </View>
      <View style={styles.row}>
        <View style={styles.line} />
        <View style={[styles.knob, styles.knobLeft]} />
      </View>
      <View style={styles.row}>
        <View style={styles.line} />
        <View style={[styles.knob, styles.knobCenter]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  row: {
    height: 7,
    justifyContent: 'center',
    position: 'relative',
    width: 26,
  },
  line: {
    backgroundColor: colors.text,
    height: 1,
    width: 26,
  },
  knob: {
    backgroundColor: colors.surface,
    borderColor: colors.text,
    borderRadius: 4,
    borderWidth: 1,
    height: 7,
    position: 'absolute',
    top: 0,
    width: 7,
  },
  knobCenter: {
    left: 12,
  },
  knobLeft: {
    left: 4,
  },
  knobRight: {
    right: 4,
  },
});

export default FilterButton;
