/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayAlert from '@clayui/alert';
import {ClaySelect} from '@clayui/form';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import ClayModal from '@clayui/modal';
import {dateUtils, sub} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

import '../../../css/components/CompareVersionsModal.scss';
import StatusLabel from '../../common/components/StatusLabel';
import {IAssetObjectEntry} from '../../common/types/AssetType';
import VersionService from '../info_panel/services/VersionService';
import {VIEW_CONTENT_VERSION_URL} from '../info_panel/util/constants';

interface CompareVersionsModalContentProps {
	apiURL: string;
	initialVersion: number;
	objectEntryId: number;
}

const getVersionLabel = (version: number) =>
	sub(Liferay.Language.get('version-x'), [version]);

type VersionsState =
	| {status: 'error' | 'loading'}
	| {items: IAssetObjectEntry[]; status: 'loaded'};

export default function CompareVersionsModalContent({
	apiURL,
	initialVersion,
	objectEntryId,
}: CompareVersionsModalContentProps) {
	const [leftVersion, setLeftVersion] = useState<number | null>(null);
	const [rightVersion, setRightVersion] = useState<number | null>(null);
	const [versionsState, setVersionsState] = useState<VersionsState>({
		status: 'loading',
	});

	useEffect(() => {
		const getVersions = async () => {
			const {data, error} = await VersionService.getObjectEntryVersions(
				apiURL,
				{page: 1, pageSize: -1, sort: 'version:desc'}
			);

			if (error !== null) {
				setVersionsState({status: 'error'});

				return;
			}

			const items: IAssetObjectEntry[] = data.items;

			const latestVersion = items[0].systemProperties.version.number;

			setLeftVersion(
				initialVersion === latestVersion
					? items[1]?.systemProperties.version.number ?? latestVersion
					: initialVersion
			);
			setRightVersion(latestVersion);
			setVersionsState({items, status: 'loaded'});
		};

		getVersions();
	}, [apiURL, initialVersion]);

	return (
		<>
			<ClayModal.Header
				closeButtonAriaLabel={Liferay.Language.get('close')}
			>
				{Liferay.Language.get('compare-versions')}
			</ClayModal.Header>

			<ClayModal.Body className="cms-compare-versions-modal-body">
				{versionsState.status === 'loading' ? (
					<ClayLoadingIndicator className="my-5" />
				) : null}

				{versionsState.status === 'error' ? (
					<ClayAlert className="m-3" displayType="danger">
						{Liferay.Language.get('an-unexpected-error-occurred')}
					</ClayAlert>
				) : null}

				{versionsState.status === 'loaded' &&
				leftVersion !== null &&
				rightVersion !== null ? (
					<div className="cms-compare-versions-panes">
						<CompareVersionPane
							objectEntryId={objectEntryId}
							onVersionChange={setLeftVersion}
							selectedVersion={leftVersion}
							versions={versionsState.items}
						/>

						<CompareVersionPane
							objectEntryId={objectEntryId}
							onVersionChange={setRightVersion}
							selectedVersion={rightVersion}
							versions={versionsState.items}
						/>
					</div>
				) : null}
			</ClayModal.Body>
		</>
	);
}

function CompareVersionPane({
	objectEntryId,
	onVersionChange,
	selectedVersion,
	versions,
}: {
	objectEntryId: number;
	onVersionChange: (version: number) => void;
	selectedVersion: number;
	versions: IAssetObjectEntry[];
}) {
	const [iframeLoading, setIframeLoading] = useState(true);

	const selectedItem = versions.find(
		(item) => item.systemProperties.version.number === selectedVersion
	);

	return (
		<div className="cms-compare-versions-pane">
			<div className="align-items-center c-gap-3 d-flex p-3">
				<ClaySelect
					aria-label={Liferay.Language.get('version')}
					className="w-auto"
					onChange={(event) => {
						setIframeLoading(true);
						onVersionChange(Number(event.target.value));
					}}
					value={selectedVersion}
				>
					{versions.map((item) => (
						<ClaySelect.Option
							key={item.systemProperties.version.number}
							label={getVersionLabel(
								item.systemProperties.version.number
							)}
							value={item.systemProperties.version.number}
						/>
					))}
				</ClaySelect>

				{selectedItem ? (
					<>
						<span className="text-secondary text-truncate">
							{sub(Liferay.Language.get('modified-by-x'), [
								selectedItem.creator.name,
							])}

							{` ${dateUtils.format(
								new Date(selectedItem.dateModified),
								'P p'
							)}`}
						</span>

						<StatusLabel label={selectedItem.status.label} />
					</>
				) : null}
			</div>

			<div className="cms-compare-versions-pane-content">
				{iframeLoading ? (
					<ClayLoadingIndicator className="my-5" />
				) : null}

				<iframe
					onLoad={() => setIframeLoading(false)}
					src={`${VIEW_CONTENT_VERSION_URL}/edit_content_item?objectEntryId=${objectEntryId}&p_l_mode=read&p_p_state=pop_up&version=${selectedVersion}`}
					title={getVersionLabel(selectedVersion)}
				/>
			</div>
		</div>
	);
}
