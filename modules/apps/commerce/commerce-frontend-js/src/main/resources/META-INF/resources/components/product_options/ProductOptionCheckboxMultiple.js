/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayForm, {ClayCheckbox} from '@clayui/form';
import {useLiferayState} from '@liferay/frontend-js-state-web';
import classnames from 'classnames';
import React, {useEffect, useState} from 'react';

import skuOptionsAtom from '../../utilities/atoms/skuOptionsAtom';
import Asterisk from './Asterisk';
import {
	getProductOptionName,
	getSkuOptionsErrors,
	initialSkuOptionsAtomState,
	isRequired,
} from './utils';

const ProductOptionCheckboxMultiple = ({
	forceRequired,
	isFromMiniCart,
	json,
	namespace,
	productOption,
}) => {
	const errorsKey = isFromMiniCart ? 'miniCartErrors' : 'errors';
	const [hasErrors, setHasErrors] = useState(false);
	const skuOptionsKey = isFromMiniCart ? 'skuMiniCartOptions' : 'skuOptions';
	const [skuOptionsAtomState, setSkuOptionsAtomState] = useLiferayState(
		skuOptionsAtom
	);

	const [productOptionValues, setProductOptionValues] = useState(
		productOption.productOptionValues
	);

	const getHasError = (optionValues, required) => {
		const hasSelectedOptions = optionValues.some(({selected}) => selected);

		return hasSelectedOptions ? !hasSelectedOptions : required;
	};

	useEffect(
		() =>
			setSkuOptionsAtomState({
				...skuOptionsAtomState,
				[errorsKey]: getSkuOptionsErrors(
					hasErrors,
					productOption,
					skuOptionsAtomState,
					isFromMiniCart
				),
				namespace,
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[hasErrors]
	);

	useEffect(() => {
		let hasPreselected = false;
		let initialSkuOptions = skuOptionsAtomState.skuOptions;

		const newProductOptionValues = productOptionValues.map(
			(productOptionValue) => {
				let isSelected = productOptionValue.preselected;

				if (isFromMiniCart) {
					const option = JSON.parse(json).find(
						({key}) => key === productOption.key
					);

					if (option) {
						isSelected =
							isSelected ||
							option.value.includes(productOptionValue.key);
					}
				}

				if (productOptionValue.preselected) {
					hasPreselected = true;

					initialSkuOptions = [
						...skuOptionsAtomState.skuOptions,
						{
							key: productOption.key,
							skuOptionKey: productOption.key,
							value: [productOptionValue.key],
						},
					];
				}

				return {
					...productOptionValue,
					selected: isSelected,
				};
			}
		);

		setProductOptionValues(newProductOptionValues);

		const required = productOption.required && !hasPreselected;

		if (required) {
			setHasErrors(getHasError(newProductOptionValues, required));
		}

		setSkuOptionsAtomState({
			...skuOptionsAtomState,
			errors: getSkuOptionsErrors(
				required,
				productOption,
				skuOptionsAtomState
			),
			namespace,
			skuOptions: initialSkuOptions,
			...(isFromMiniCart && {
				skuMiniCartOptions: initialSkuOptions,
			}),
		});

		return () =>
			isFromMiniCart
				? setSkuOptionsAtomState({
						...skuOptionsAtomState,
						miniCartErrors: [],
						skuMiniCartOptions: [],
				  })
				: setSkuOptionsAtomState(initialSkuOptionsAtomState);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChange = ({target: {checked, value}}) => {
		if (skuOptionsAtomState.updating) {
			return;
		}

		setSkuOptionsAtomState({...skuOptionsAtomState, updating: true});

		let currentSkuOptions = skuOptionsAtomState[skuOptionsKey];

		const curSkuOptionIndex = currentSkuOptions.findIndex(
			(skuOption) => skuOption.skuOptionKey === productOption.key
		);

		const currentSkuOption = currentSkuOptions.filter(
			(skuOption) => skuOption.skuOptionKey === productOption.key
		)[0];

		if (currentSkuOption) {
			currentSkuOptions = currentSkuOptions.map((skuOption) => {
				if (skuOption.skuOptionKey === productOption.key) {
					return {
						key: productOption.key,
						skuOptionKey: productOption.key,
						value: checked
							? [
									...currentSkuOptions[curSkuOptionIndex]
										.value,
									value,
							  ]
							: currentSkuOptions[curSkuOptionIndex].value.filter(
									(curVal) => !(curVal === value)
							  ),
					};
				}

				return skuOption;
			});
		}
		else {
			currentSkuOptions = [
				...currentSkuOptions,
				{
					key: productOption.key,
					skuOptionKey: productOption.key,
					value: [value],
				},
			];
		}

		const curProductOptionValueIndex = productOptionValues.findIndex(
			(productOptionValue) => productOptionValue.key === value
		);

		productOptionValues[curProductOptionValueIndex] = {
			...productOptionValues[curProductOptionValueIndex],
			selected: checked,
		};

		setProductOptionValues(productOptionValues);

		const required = forceRequired || productOption.required;
		const hasError = getHasError(productOptionValues, required);

		setHasErrors(hasError);

		setSkuOptionsAtomState({
			...skuOptionsAtomState,
			[errorsKey]: getSkuOptionsErrors(
				hasError,
				productOption,
				skuOptionsAtomState,
				isFromMiniCart
			),
			[skuOptionsKey]: currentSkuOptions,
			updating: false,
		});
	};

	return (
		<ClayForm.Group className={classnames({'has-error': hasErrors})}>
			<label>
				{getProductOptionName(productOption.name)}

				<Asterisk
					required={isRequired(
						forceRequired,
						skuOptionsAtomState.isAdmin,
						productOption
					)}
				/>
			</label>

			{productOptionValues.map(({key, name, selected}) => (
				<ClayCheckbox
					checked={selected}
					key={key}
					label={name}
					name={key}
					onChange={handleChange}
					value={key}
				/>
			))}

			{hasErrors && (
				<ClayForm.FeedbackItem>
					<ClayForm.FeedbackIndicator symbol="exclamation-full" />

					{Liferay.Language.get('this-field-is-required')}
				</ClayForm.FeedbackItem>
			)}
		</ClayForm.Group>
	);
};

export default ProductOptionCheckboxMultiple;
