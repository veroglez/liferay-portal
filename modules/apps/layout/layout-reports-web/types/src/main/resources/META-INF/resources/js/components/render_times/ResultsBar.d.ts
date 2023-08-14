/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

import {Fragment, FragmentsFilter} from '../../constants/fragments';
interface PropsResultsBar {
	className: string;
	filter: FragmentsFilter;
	fragments: Fragment[];
	onSetFilter: Function;
}
export default function ResultsBar({
	className,
	filter,
	fragments,
	onSetFilter,
}: PropsResultsBar): JSX.Element | null;
export {};
