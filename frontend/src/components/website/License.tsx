import React from 'react';
import { Award, FileText, ExternalLink, Shield } from 'lucide-react';

interface LicenseProps {
    translations: any;
}

const License: React.FC<LicenseProps> = ({ translations }) => {
    const certificateLink = 'https://drive.google.com/file/d/1XE-gO827wIp-ZJnwuy4TT6yFtIJRtM1Y/view?usp=sharing';

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div id='license' className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
                        {translations.license.badge}
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{translations.license.title}</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        {translations.license.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Award className="h-6 w-6 text-green-700" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{translations.license.certification.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{translations.license.certification.description}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Shield className="h-6 w-6 text-blue-700" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{translations.license.compliance.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{translations.license.compliance.description}</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <FileText className="h-8 w-8 text-green-700" />
                                    <div>
                                        <p className="font-semibold text-gray-900">{translations.license.viewCertificate}</p>
                                        <p className="text-sm text-gray-600">{translations.license.viewCertificateDesc}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100">
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto">
                                <Award className="h-10 w-10 text-green-700" />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-gray-900">{translations.license.officialLicense}</h3>
                                <p className="text-gray-600">{translations.license.licenseDescription}</p>
                            </div>

                            <a
                                href={certificateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <span>{translations.license.viewCertificateButton}</span>
                                <ExternalLink className="ml-2 h-5 w-5" />
                            </a>

                            <p className="text-xs text-gray-500 pt-2">
                                {translations.license.opensInNewTab}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default License;

