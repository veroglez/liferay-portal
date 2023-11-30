/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Option, Picker} from '@clayui/core';
import ClayIcon from '@clayui/icon';
import ClayLayout from '@clayui/layout';
import {useId} from 'frontend-js-components-web';
import {sub} from 'frontend-js-web';
import React, {useState} from 'react';

import StatusLabel from './StatusLabel';

const TriggerLabel = React.forwardRef(
	(
		{selectedItem, ...otherProps}: {selectedItem: Locale},
		ref: React.LegacyRef<HTMLButtonElement>
	) => {
		return (
			<button
				{...otherProps}
				className="btn btn-block btn-secondary btn-sm form-control-select"
				ref={ref}
			>
				<span className="inline-item-before">
					<ClayIcon symbol={selectedItem.icon} />
				</span>

				<span aria-hidden="true">{selectedItem.label}</span>
			</button>
		);
	}
);
export interface Locale {
	icon: string;
	id: Liferay.Language.Locale;
	label: Liferay.Language.Locale;
	translations: number;
}

export interface Translations {
	[key: string]: Record<Liferay.Language.Locale, string>;
}

interface Props {

	/**
	 * Current default locale
	 */
	defaultLocaleId: string;

	/**
	 * List of locales to allow localization for
	 */
	locales: Locale[];

	/**
	 * Callback that gets called when a selected locale gets changed
	 */
	onSelectedLocaleChange: (item: any) => void;

	/**
	 * Currently selected locale
	 */
	selectedLocaleId: Liferay.Language.Locale;

	/**
	 * Translations provided to the component to be used and modified by it
	 */
	translations: Translations;
}

export default function TranslationSelector({
	defaultLocaleId,
	locales,
	onSelectedLocaleChange,
	selectedLocaleId,
	translations,
}: Props) {
	const selectorId = useId();

	const getSelectedLocale = (id: React.Key) =>
		locales.find((locale) => locale.id === id)!;

	const [selectedLocale, setSelectedLocale] = useState<Locale>(
		locales.find((locale) => locale.id === selectedLocaleId)!
	);

	const items = translations
		? locales.map((locale) => ({
				...locale,
				translations: Object.values(translations).filter(
					(translation) => translation[locale.id]
				).length,
		  }))
		: locales;

	return (
		<Picker
			aria-label={sub(
				Liferay.Language.get('select-a-language.-current-language-x'),
				selectedLocale.label
			)}
			as={TriggerLabel}
			id={selectorId}
			items={items}
			onSelectionChange={(key: React.Key) => {
				onSelectedLocaleChange(key);
				setSelectedLocale(getSelectedLocale(key));
			}}
			selectedItem={selectedLocale}
			selectedKey={selectedLocale.id}
		>
			{(item) => (
				<Option key={item.id} textValue={item.label}>
					<ClayLayout.ContentRow containerElement="span">
						<ClayLayout.ContentCol containerElement="span" expand>
							<ClayLayout.ContentSection>
								<ClayIcon
									className="inline-item-before"
									symbol={item.icon}
								/>

								<span aria-hidden="true">{item.label}</span>
							</ClayLayout.ContentSection>
						</ClayLayout.ContentCol>

						<StatusLabel
							defaultLocaleId={defaultLocaleId}
							item={item}
							translations={translations}
						/>
					</ClayLayout.ContentRow>
				</Option>
			)}
		</Picker>
	);
}
