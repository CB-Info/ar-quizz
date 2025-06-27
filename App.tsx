import {
  Viro3DObject,
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  ViroTrackingReason,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

function ARScene() {
  return (
    <ViroARScene>
      <Viro3DObject
        source={require("./assets/models/SP2_Gun.obj")}
        resources={[
          require("./assets/models/SP2_Gun.mtl"),
          require("./assets/models/SP2_Gun_1.png")
        ]}
        position={[0, 0, -1]}
        scale={[0.01, 0.01, 0.01]}
        type="OBJ"
      />
    </ViroARScene>
  );
}

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{ scene: () => <ARScene/> }}
      style={{ flex: 1 }}
    />
  );
};

var styles = StyleSheet.create({
  f1: { flex: 1 },
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});
