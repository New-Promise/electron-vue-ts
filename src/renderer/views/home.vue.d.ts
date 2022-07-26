import { Vue } from 'vue-property-decorator';
export default class Home extends Vue {
    iframeUrl: string;
    isIframe: boolean;
    created(): void;
    getConfigData(): void;
}
