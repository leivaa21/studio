import { ComponentMeta, ComponentStory } from "@storybook/react";

import Button from '@studio/ui/components/interactivity/cta/button';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    Label: {
      control: 'text',
      description: 'Label to be displayed on the button',
      type: {
        name: 'string',
        required: true,
      }
    },
    Type: {
      control: 'select',
      description: 'Type of the button',
      defaultValue: {summary: 'Primary'},
      options: ['Primary', 'Secondary', 'Tertiary', 'Cancel']
    },
    Size: {
      control: 'select',
      description: 'Size of the button',
      defaultValue: {summary: 'Medium'},
      options: ['Small', 'Medium', 'Large']
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Button>;


const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  Label: 'Button',
  Type: 'Primary',
  Size: 'Medium',
};

export const Secondary = Template.bind({});
Secondary.args = {
  Label: 'Button',
  Type: 'Secondary',
  Size: 'Medium',
};

export const Large = Template.bind({});
Large.args = {
  Label: 'Button',
  Type: 'Primary',
  Size: 'Large',
};

export const Small = Template.bind({});
Small.args = {
  Type: 'Primary',
  Size: 'Small',
  Label: 'Button',
};