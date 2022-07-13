/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayButton from '@clayui/button';
import ClayDropDown, {Align} from '@clayui/drop-down';
import ClayForm, {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

import useControlledState from '../../../core/hooks/useControlledState';
import {ConfigurationFieldPropTypes} from '../../../prop-types/index';
import {useId} from '../../utils/useId';

const UNITS = [
	{label: 'px'},
	{label: '%'},
	{label: 'em'},
	{label: 'rem'},
	{icon: 'code', label: 'auto'},
	{label: 'vw'},
	{label: 'vh'},
	{icon: 'code', label: 'custom'},
];

export function LengthField({field, onValueSelect, value}) {
	const inputId = useId();
	const selectLabelId = useId();
	const helpTextId = useId();

	const [active, setActive] = useState(false);
	const [nextValue, setNextValue] = useControlledState(value);
	const [unit, setUnit] = useState(UNITS[0]);

	return (
		<ClayForm.Group>
			<label htmlFor={inputId}>{field.label}</label>

			<ClayInput.Group>
				<ClayInput.GroupItem prepend>
					<ClayInput
						aria-describedby={helpTextId}
						id={inputId}
						onBlur={() => {
							console.log('hago cosas');
						}}
						sizing="sm"
						small
						type="number"
					/>
				</ClayInput.GroupItem>

				<ClayInput.GroupItem append shrink>
					<ClayDropDown
						active={active}
						alignmentPosition={Align.BottomRight}
						aria-labelledby={selectLabelId}
						menuElementAttrs={{
							containerProps: {
								className: 'cadmin',
							},
						}}
						onActiveChange={setActive}
						small
						trigger={
							<ClayButton displayType="secondary" small>
								{unit.icon ? (
									<ClayIcon
										className="mt-0"
										symbol={unit.icon || ''}
									/>
								) : (
									unit.label.toUpperCase()
								)}
							</ClayButton>
						}
					>
						<ClayDropDown.ItemList>
							{UNITS.map((unit) => (
								<ClayDropDown.Item
									key={unit.label}
									onClick={() => {
										setActive(false);
										setUnit(unit);
									}}
								>
									{unit.label.toUpperCase()}
								</ClayDropDown.Item>
							))}
						</ClayDropDown.ItemList>
					</ClayDropDown>
				</ClayInput.GroupItem>
			</ClayInput.Group>
		</ClayForm.Group>
	);
}

LengthField.propTypes = {
	field: PropTypes.shape(ConfigurationFieldPropTypes).isRequired,
	onValueSelect: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
