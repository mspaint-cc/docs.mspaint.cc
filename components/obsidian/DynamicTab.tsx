import { memo, useMemo, FC } from "react";

import { TabData, UIElement, Addons } from "./element.types";
import { Groupbox } from "./elements/GroupBox";
import { TabContainer, TabLeft, TabRight } from "./elements/Tab";
import Divider from "./elements/Divider";
import Toggle from "./elements/Toggle";
import Button from "./elements/Button";
import ObsidianImage from "./elements/Image";
import Label from "./elements/Label";
import Tabbox from "./elements/TabBox";
import Dropdown from "./elements/Dropdown";
import Input from "./elements/Input";
import Slider from "./elements/Slider";
import KeyPicker from "./elements/addons/KeyPicker";
import AddonContainer from "./elements/addons/AddonContainer";
import ColorPicker from "./elements/addons/ColorPicker";
import ObsidianWarningBox from "./elements/WarningBox";

// Parsers //
const renderAddons = (
  element: UIElement,
  addons?: Addons[],
  stateKeyPrefix?: string
) => {
  if (!addons || addons.length === 0) return null;

  const scope = stateKeyPrefix || "global";
  return (
    <AddonContainer className="absolute inset-0 pointer-events-none">
      {addons.map((addon, idx) => {
        const addonKey = `${scope}:addon:${addon.type}:${element.index}:${idx}`;

        switch (addon.type) {
          case "KeyPicker":
            return (
              <KeyPicker
                key={idx}
                defaultValue={addon.value}
                className="pointer-events-auto"
                stateKey={addonKey}
              />
            );

          case "ColorPicker":
            return (
              <ColorPicker
                key={idx}
                title={addon.title}
                defaultValue={addon.value}
                className="pointer-events-auto"
                stateKey={addonKey}
              />
            );

          default:
            return null;
        }
      })}
    </AddonContainer>
  );
};

export const ElementParser: FC<{
  element: UIElement;
  stateKeyPrefix?: string;
}> = ({ element, stateKeyPrefix }) => {
  if ("visible" in element && !element.visible) return null;

  const scope = stateKeyPrefix || "global";
  const addons = (element as unknown as { properties?: { addons?: Addons[] } })
    .properties?.addons;
  const core = (() => {
    switch (element.type) {
      case "Toggle":
        return (
          <Toggle
            text={element.text}
            risky={element.properties.risky}
            checked={element.value}
            stateKey={`${scope}:el:Toggle:${element.index}`}
          />
        );

      case "Label":
        return <Label>{element.text}</Label>;

      case "Button":
        return <Button text={element.text} subButton={element.subButton} />;

      case "Dropdown":
        return (
          <Dropdown
            text={element.text}
            value={element.value}
            options={element.properties.values}
            multi={element.properties.multi === true}
            disabledValues={element.properties.disabledValues || []}
            stateKey={`${scope}:el:Dropdown:${element.index}`}
          />
        );

      case "Slider":
        return (
          <Slider
            text={element.text}
            value={element.value}
            min={element.properties.min}
            max={element.properties.max}
            compact={element.properties.compact}
            rounding={element.properties.rounding}
            prefix={element.properties.prefix}
            suffix={element.properties.suffix}
            stateKey={`${scope}:el:Slider:${element.index}`}
          />
        );

      case "Input":
        return (
          <Input
            text={element.text}
            value={element.value}
            placeholder={element.properties.placeholder}
            stateKey={`${scope}:el:Input:${element.index}`}
          />
        );

      case "Divider":
        return <Divider />;

      case "Image":
        return (
          <ObsidianImage
            image={element.properties.image}
            transparency={element.properties.transparency}
            scaleType={element.properties.scaleType}
            color={element.properties.color}
            rectOffset={element.properties.rectOffset}
            height={element.properties.height}
            rectSize={element.properties.rectSize}
          />
        );

      default:
        return (
          <div className="text-red-400 text-left">
            Unknown element type:{" "}
            {(element as { type: string }).type || "Unknown"}
          </div>
        );
    }
  })();

  return (
    <div className="relative">
      {core}
      {renderAddons(element, addons, stateKeyPrefix)}
    </div>
  );
};

const TabParserComponent: FC<{ tabData: TabData | null }> = ({ tabData }) => {
  const { groupboxes, tabboxes, warningBox } = tabData || {};

  const leftGroupboxes = useMemo(
    () =>
      groupboxes?.Left
        ? Object.values(groupboxes.Left).sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0)
          )
        : [],
    [groupboxes?.Left]
  );

  const rightGroupboxes = useMemo(
    () =>
      groupboxes?.Right
        ? Object.values(groupboxes.Right).sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0)
          )
        : [],
    [groupboxes?.Right]
  );

  const leftTabboxes = useMemo(
    () => (tabboxes?.Left ? Object.values(tabboxes.Left) : []),
    [tabboxes?.Left]
  );

  const rightTabboxes = useMemo(
    () => (tabboxes?.Right ? Object.values(tabboxes.Right) : []),
    [tabboxes?.Right]
  );

  if (!tabData) return null;

  return (
    <>
      {warningBox && (
        <ObsidianWarningBox
          text={warningBox.Text}
          title={warningBox.Title}
          visible={warningBox.Visible}
          isNormal={warningBox.IsNormal}
          lockSize={warningBox.LockSize}
        />
      )}
      <TabContainer>
        <TabLeft>
          {leftTabboxes.map((tabbox) => (
            <Tabbox
              key={tabbox.name}
              tabs={tabbox.tabs}
              scope={`tab:${tabData.name}:left:tabbox:${tabbox.name}`}
            />
          ))}
          {leftGroupboxes.map((gb) => (
            <Groupbox key={gb.name} title={gb.name}>
              {gb.elements.map((el) => (
                <ElementParser
                  key={`left-gb-${gb.name}-${el.index}`}
                  element={el}
                  stateKeyPrefix={`gb:${tabData.name}:left:groupbox:${gb.name}`}
                />
              ))}
            </Groupbox>
          ))}
        </TabLeft>
        <TabRight>
          {rightTabboxes.map((tabbox) => (
            <Tabbox
              key={tabbox.name}
              tabs={tabbox.tabs}
              scope={`tab:${tabData.name}:right:tabbox:${tabbox.name}`}
            />
          ))}
          {rightGroupboxes.map((gb) => (
            <Groupbox key={gb.name} title={gb.name}>
              {gb.elements.map((el) => (
                <ElementParser
                  key={`right-gb-${gb.name}-${el.index}`}
                  element={el}
                  stateKeyPrefix={`gb:${tabData.name}:right:groupbox:${gb.name}`}
                />
              ))}
            </Groupbox>
          ))}
        </TabRight>
      </TabContainer>
    </>
  );
};

TabParserComponent.displayName = "TabParser";
export const TabParser = memo(TabParserComponent);
