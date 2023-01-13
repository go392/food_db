import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import * as AminoAcidScorePage from "./amino_acid_score/[year]"

export const getStaticProps: GetStaticProps =  async (context : GetStaticPropsContext) =>{
  return AminoAcidScorePage.getStaticProps({ params:{ year:"2007" } });
}
  
const AminoAcidScoreHome: NextPage<AminoAcidScorePage.Props> = (props : AminoAcidScorePage.Props) => {
  return <AminoAcidScorePage.default
    data={props.data}
    year={props.year}
    yearList={props.yearList}
  />
}

export default AminoAcidScoreHome;