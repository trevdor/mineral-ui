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
import Box from '../../Box/components/Box';
import StartEnd from '../components/StartEnd';
import responsiveInstructions from '../../Box/components/responsiveInstructions';

export default {
  id: 'responsive',
  title: 'Responsive',
  description: `Many of the properties for StartEnd can be responsive:

${responsiveInstructions}

The code in the example below exhibits the following behavior:

1. When the viewport is less than 800px wide, it will display as a column.
1. When the viewport is at least 800px wide, it will display as a row.`,
  scope: { Box, StartEnd },
  source: `
    <StartEnd
      breakpoints={[800]}
      direction={['column', 'row']}>
      <Box>Start</Box>
      <Box>End</Box>
    </StartEnd>`
};