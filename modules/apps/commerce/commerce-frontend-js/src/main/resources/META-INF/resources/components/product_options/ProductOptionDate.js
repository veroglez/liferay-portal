/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayForm, {ClayInput} from '@clayui/form';
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

const ProductOptionDate = ({
	componentId,
	forceRequired = false,
	isFromMiniCart = false,
	json,
	namespace,
	productOption,
}) => {
	const [date, setDate] = useState('');
	const errorsKey = isFromMiniCart ? 'miniCartErrors' : 'errors';
	const [hasErrors, setHasErrors] = useState(false);
	const skuOptionsKey = isFromMiniCart ? 'skuMiniCartOptions' : 'skuOptions';

	const [skuOptionsAtomState, setSkuOptionsAtomState] = useLiferayState(
		skuOptionsAtom
	);

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
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[hasErrors]
	);

	useEffect(() => {
		let value = '';

		if (isFromMiniCart) {
			const option = JSON.parse(json).find(
				({key}) => key === productOption.key
			);
			[value] = option.value;

			setDate(value);
		}

		if (productOption.required && !value) {
			setHasErrors(true);
		}

		setSkuOptionsAtomState({
			...skuOptionsAtomState,
			errors: getSkuOptionsErrors(
				productOption.required,
				productOption,
				skuOptionsAtomState
			),
			namespace,
			skuOptions: [
				...skuOptionsAtomState.skuOptions,
				{
					key: productOption.key,
					skuOptionKey: productOption.key,
					value: [value],
				},
			],
			...(isFromMiniCart && {
				skuMiniCartOptions: skuOptionsAtomState.skuOptions,
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

	const handleChange = ({target: {value}}) => {
		if (skuOptionsAtomState.updating) {
			return;
		}

		setSkuOptionsAtomState({...skuOptionsAtomState, updating: true});

		setDate(value);

		let currentSkuOptions = skuOptionsAtomState[skuOptionsKey];

		const currentSkuOption = currentSkuOptions.find(
			(skuOption) => skuOption.skuOptionKey === productOption.key
		);

		if (currentSkuOption) {
			currentSkuOptions = currentSkuOptions.map((skuOption) => {
				if (skuOption.skuOptionKey === productOption.key) {
					return {
						key: productOption.key,
						skuOptionKey: productOption.key,
						value: [value],
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

		const required = (forceRequired || productOption.required) && !value;

		setHasErrors(required);

		setSkuOptionsAtomState({
			...skuOptionsAtomState,
			[errorsKey]: getSkuOptionsErrors(
				required,
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
			<label htmlFor={componentId}>
				{getProductOptionName(productOption.name)}

				<Asterisk
					required={isRequired(
						forceRequired,
						skuOptionsAtomState.isAdmin,
						productOption
					)}
				/>
			</label>

			<ClayInput
				disabled={skuOptionsAtomState.updating}
				id={componentId}
				name={productOption.key}
				onChange={handleChange}
				type="date"
				value={date}
			/>

			{hasErrors && (
				<ClayForm.FeedbackItem>
					<ClayForm.FeedbackIndicator symbol="exclamation-full" />

					{Liferay.Language.get('this-field-is-required')}
				</ClayForm.FeedbackItem>
			)}
		</ClayForm.Group>
	);
};

export default ProductOptionDate;
