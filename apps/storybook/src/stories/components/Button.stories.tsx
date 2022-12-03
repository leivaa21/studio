import { ComponentMeta, ComponentStory } from "@storybook/react";

import Button from '@studio/ui/components/interactivity/cta/button';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    Type: {
      control: 'select',
      options: ['Primary', 'Secondary', 'Tertiary', 'Cancel']
    },
    Size: {
      control: 'select',
      options: ['Small', 'Medium', 'Large']
    },
    Label: {
      control: 'text',
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Button>;


const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  Type: 'Primary',
  Size: 'Medium',
  Label: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  Type: 'Secondary',
  Size: 'Medium',
  Label: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  Type: 'Primary',
  Size: 'Large',
  Label: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  Type: 'Primary',
  Size: 'Small',
  Label: 'Button',
};