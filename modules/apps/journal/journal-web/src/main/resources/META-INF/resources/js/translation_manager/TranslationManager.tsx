/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Translation} from '@liferay/layout-js-components-web';
import {Locale, TranslationAdminSelector} from 'frontend-js-components-web';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

type Field = Record<Liferay.Language.Locale, string>;

interface Props {
	defaultLanguageId: Liferay.Language.Locale;
	fields: Record<string, Field>;
	locales: Locale[];
	portletNamespace: string;
	selectedLanguageId: Liferay.Language.Locale;
}

export default function TranslationManager({
	defaultLanguageId,
	fields,
	locales,
	portletNamespace,
	selectedLanguageId: initialSelectedLanguageId,
}: Props) {
	const [translations, setTranslations] = useState<Translation[]>(
		fieldToTranslation(fields)
	);
	const [selectedLanguageId, setSelectedLanguageId] = useState<
		Liferay.Language.Locale
	>(initialSelectedLanguageId);

	const getTranslations = useCallback(
		() =>
			Object.keys(fields).map((fieldName) => {
				const languages = Array.from(
					document.querySelectorAll<HTMLInputElement>(
						`[type="hidden"][id*="${portletNamespace}${fieldName}_"]`
					)
				)
					.filter((input) => input.value)
					.map(
						({dataset}) =>
							dataset.languageid as Liferay.Language.Locale
					);

				return {
					fieldName,
					languages,
				};
			}),
		[fields, portletNamespace]
	);

	const translatedItems = useMemo(
		() =>
			locales.reduce((acc, locale) => {
				const translatedItems = translations.filter(({languages}) =>
					languages.includes(locale.id)
				).length;

				console.log(1, translatedItems);

				return {
					...acc,
					...(translatedItems && {[locale.id]: translatedItems}),
				};
			}, {}),
		[translations, locales]
	);

	console.log('AAA', translatedItems);

	useEffect(() => {
		Liferay.on('inputLocalized:updateTranslationStatus', () =>
			setTranslations(getTranslations())
		);
	}, [getTranslations]);

	useEffect(() => {
		Liferay.fire('inputLocalized:localeChanged', {
			item: document.querySelector(
				`[data-languageid="${selectedLanguageId}"]`
			),
		});
	}, [selectedLanguageId]);

	return (

		// <div>hola</div>

		<TranslationAdminSelector
			activeLanguageIds={locales.map(({id}) => id)}
			adminMode
			availableLocales={locales}
			defaultLanguageId={defaultLanguageId}
			horizontalDisplay
			onSelectedLanguageIdChange={(id) => {

				// Liferay.fire('inputLocalized:localeChanged', {
				// 	item: document.querySelector(`[data-languageid="${id}"]`),
				// });

				setSelectedLanguageId(id);
			}}
			selectedLanguageId={selectedLanguageId}
			translationProgress={
				Object.keys(translatedItems).length
					? {
							totalItems: Object.keys(fields).length,
							translatedItems,
					  }
					: null
			}
		/>
	);
}

function fieldToTranslation(fields: Record<string, Field>) {
	const translations = [];

	for (const fieldName in fields) {
		const languages = fields[fieldName]
			? (Object.keys(fields[fieldName]) as Liferay.Language.Locale[])
			: [];

		translations.push({
			fieldName,
			languages,
		});
	}

	return translations;
}
