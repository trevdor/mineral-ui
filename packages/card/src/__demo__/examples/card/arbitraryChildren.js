/**
 * Copyright 2017 CA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* @flow */
import {
  createStyledComponent,
  mineralTheme
} from '@mineral-ui/component-utils';
import Button from '@mineral-ui/button';
import Card from '../../../Card';
import CardTitle from '../../../CardTitle';
import DemoLayout from '../../components/DemoLayout';

const CustomContent = createStyledComponent('div', (props, theme) => ({
  backgroundColor: theme.color_gray_20,
  margin: `${theme.spacing_double} 0`,
  padding: theme.spacing_triple,

  '&:last-child': {
    borderRadius: `0 0 ${theme.borderRadius_1} ${theme.borderRadius_1}`,
    marginBottom: `-${theme.spacing_double}`
  }
}));

export default {
  title: 'Arbitrary children',
  backgroundColor: mineralTheme.color_gray_10,
  description:
    'A Card will render any children. For best results, please make sure your content matches the top/bottom margin and left/right padding of the other Card* components.',
  scope: { Button, Card, CardTitle, CustomContent, DemoLayout },
  source: `<DemoLayout>
  <Card>
    <CardTitle>Card title</CardTitle>
    <CustomContent>
      <Button fullWidth>Button</Button>
    </CustomContent>
  </Card>
</DemoLayout>`
};