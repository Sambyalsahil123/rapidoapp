import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const CustomDropdown = ({
  options,
  displayOptions,
  onSelectOption,
  style,
  placeholder,
}) => {
  const [selectedOption, setSelectedOption] = useState(options[''])
  const [showOptions, setShowOptions] = useState(false)

  const renderOptions = () => {
    return options.map((option, index) => {
      return (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => {
            setSelectedOption(option)
            setShowOptions(false)
            onSelectOption(option)
          }}>
          <Text style={styles.optionText}>{displayOptions[index]}</Text>
        </TouchableOpacity>
      )
    })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={style}
        onPress={() => setShowOptions(!showOptions)}>
        <Text
          style={
            selectedOption ? styles.selectedText : styles.selectedOptionText
          }>
          {selectedOption
            ? displayOptions[options.indexOf(selectedOption)]
            : placeholder}
        </Text>
      </TouchableOpacity>
      {showOptions && (
        <View style={styles.optionsContainer}>{renderOptions()}</View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '100%',
    zIndex: 100,
  },
  selectedOption: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#aaaaaa',
    borderRadius: 25,
  },
  selectedOptionText: {
    width:"100%",
    color: '#aaaaaa',
    marginTop: 10,
  },
  selectedText: {
    width:"100%",
    color: 'rgba(0,0,0,0.7)',
    marginTop: 10,
  },
  optionsContainer: {
    marginLeft: '10%',
    width: '80%',
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#aaaaaa',
    borderRadius: 5,
    padding: 8,
    zIndex: 100,
  },
  option: {
    padding: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 12,
  },
  optionText: {
    fontSize: 12,
  },
})

export default CustomDropdown
